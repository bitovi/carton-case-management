import { useSlate } from 'slate-react';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { isMarkActive, toggleMark } from './plugins/withFormatting';
import { isListActive, toggleList } from './plugins/withLists';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { Bold, Italic, Underline, List, ListOrdered, ChevronDown } from 'lucide-react';

export function RichTextToolbar() {
  const editor = useSlate();

  const handleToggleBold = () => {
    toggleMark(editor, 'bold');
  };

  const handleToggleItalic = () => {
    toggleMark(editor, 'italic');
  };

  const handleToggleUnderline = () => {
    toggleMark(editor, 'underline');
  };

  const handleToggleHeading = (
    type:
      | 'paragraph'
      | 'heading-one'
      | 'heading-two'
      | 'heading-three'
      | 'heading-four'
      | 'heading-five'
      | 'heading-six'
  ) => {
    Transforms.setNodes(
      editor,
      { type },
      { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
    );
  };

  const isBoldActive = isMarkActive(editor, 'bold');
  const isItalicActive = isMarkActive(editor, 'italic');
  const isUnderlineActive = isMarkActive(editor, 'underline');

  // Check current block type
  const [match] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
  });
  const currentBlockType = match && SlateElement.isElement(match[0]) ? match[0].type : 'paragraph';
  const blockTypeLabels: Record<string, string> = {
    paragraph: 'Paragraph',
    'heading-one': 'Heading 1',
    'heading-two': 'Heading 2',
    'heading-three': 'Heading 3',
    'heading-four': 'Heading 4',
    'heading-five': 'Heading 5',
    'heading-six': 'Heading 6',
  };
  const blockTypeLabel = blockTypeLabels[currentBlockType as string] || 'Paragraph';

  return (
    <div className="flex items-center gap-1 border-b bg-muted/50 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 gap-1 min-w-[120px] justify-between"
            title="Text Format"
          >
            <span className="text-xs">{blockTypeLabel}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => handleToggleHeading('paragraph')}>
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleHeading('heading-one')}>
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleHeading('heading-two')}>
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleHeading('heading-three')}>
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleHeading('heading-four')}>
            Heading 4
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleHeading('heading-five')}>
            Heading 5
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleToggleHeading('heading-six')}>
            Heading 6
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border" />

      <Button
        type="button"
        variant={isBoldActive ? 'default' : 'ghost'}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          handleToggleBold();
        }}
        className="h-8 w-8 p-0"
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={isItalicActive ? 'default' : 'ghost'}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          handleToggleItalic();
        }}
        className="h-8 w-8 p-0"
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={isUnderlineActive ? 'default' : 'ghost'}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          handleToggleUnderline();
        }}
        className="h-8 w-8 p-0"
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border" />

      <Button
        type="button"
        variant={isListActive(editor, 'bulleted-list') ? 'default' : 'ghost'}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleList(editor, 'bulleted-list');
        }}
        className="h-8 w-8 p-0"
        title="Bulleted List"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={isListActive(editor, 'numbered-list') ? 'default' : 'ghost'}
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleList(editor, 'numbered-list');
        }}
        className="h-8 w-8 p-0"
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}
