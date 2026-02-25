import ParChat from '@/components/ParChat/ParChat';

export function ParChatPage() {
  return (
    <div className="w-full bg-[#fbfcfc] lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4">
      <h1 className="text-2xl font-semibold mb-6">AI Assistant</h1>
      <ParChat />
    </div>
  );
}
