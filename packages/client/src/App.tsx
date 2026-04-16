import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { FolderClosed, Users, Bot } from 'lucide-react';
import { Header } from './components/Header';
import { MenuList } from './components/MenuList';
import { CasePage } from './pages/CasePage';
import { CustomerPage } from './pages/CustomerPage';
import { UserPage } from './pages/UserPage';
import { trpc } from './lib/trpc';

function App() {
  const location = useLocation();

  useEffect(() => {
    const caseWordPattern = /\b(case)\b/i;
    const caseWordPatternGlobal = /\b(case)\b/gi;

    const wrapCaseWordsInNode = (textNode: Text) => {
      const text = textNode.nodeValue;
      if (!text) {
        return;
      }

      caseWordPatternGlobal.lastIndex = 0;
      if (!caseWordPatternGlobal.test(text)) {
        return;
      }

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      caseWordPatternGlobal.lastIndex = 0;
      while ((match = caseWordPatternGlobal.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const highlightedWord = document.createElement('span');
        highlightedWord.textContent = match[0];
        highlightedWord.style.color = '#dc2626';
        highlightedWord.setAttribute('data-case-colorized', 'true');
        fragment.appendChild(highlightedWord);

        lastIndex = caseWordPatternGlobal.lastIndex;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.parentNode?.replaceChild(fragment, textNode);
    };

    const processNodeTree = (rootNode: Node) => {
      const walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const textNode = node as Text;
            const parentElement = textNode.parentElement;

            if (!parentElement) {
              return NodeFilter.FILTER_REJECT;
            }

            if (parentElement.closest('[data-case-colorized="true"]')) {
              return NodeFilter.FILTER_REJECT;
            }

            const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'OPTION'];
            if (skipTags.includes(parentElement.tagName)) {
              return NodeFilter.FILTER_REJECT;
            }

            return caseWordPattern.test(textNode.nodeValue || '')
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );

      const nodesToProcess: Text[] = [];
      let currentNode = walker.nextNode();

      while (currentNode) {
        nodesToProcess.push(currentNode as Text);
        currentNode = walker.nextNode();
      }

      nodesToProcess.forEach(wrapCaseWordsInNode);
    };

    const observer = new MutationObserver((mutations) => {
      observer.disconnect();

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addedNode) => {
          processNodeTree(addedNode);
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });

    processNodeTree(document.body);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
  
  const menuItems = [
    { id: 'home', label: 'Cases', path: '/cases/', icon: <FolderClosed size={20} />, isActive: location.pathname === '/' || location.pathname.startsWith('/cases') },
    { id: 'users', label: 'Users', path: '/users/', icon: <Bot size={20} />, isActive: location.pathname.startsWith('/users') },
    { id: 'customers', label: 'Customers', path: '/customers/', icon: <Users size={20} />, isActive: location.pathname.startsWith('/customers') },
  ];
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();

  // Show loading state while fetching user
  if (isLoading) {
    return (
      <div className="h-screen bg-[#dfe2e2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication fails
  if (error || !user) {
    return (
      <div className="h-screen bg-[#dfe2e2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Unauthorized</p>
          <p className="text-gray-600 text-sm">
            Make sure your server is running and your database is seeded
          </p>
        </div>
      </div>
    );
  }

  // Derive initials from user first and last name (e.g., "Alex" "Morgan" -> "AM")
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="h-screen bg-[#dfe2e2] flex flex-col">
      <Header userInitials={userInitials} />
      <MenuList items={menuItems} />
      <div className="flex flex-1 overflow-hidden lg:pl-[68px]">
        <main className="flex-1 lg:p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<CasePage />} />
            <Route path="/cases/" element={<CasePage />} />
            <Route path="/cases/:id" element={<CasePage />} />
            <Route path="/users/" element={<UserPage />} />
            <Route path="/users/:id" element={<UserPage />} />
            <Route path="/customers/" element={<CustomerPage />} />
            <Route path="/customers/:id" element={<CustomerPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
