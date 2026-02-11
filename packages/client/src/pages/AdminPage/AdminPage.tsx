import { useState } from 'react';
import { Button } from '@/components/obra/Button';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { trpc } from '@/lib/trpc';

export function AdminPage() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resetMutation = trpc.admin.resetDatabase.useMutation({
    onSuccess: () => {
      setResultMessage({ type: 'success', text: 'Database reset and seeded successfully!' });
      setShowConfirmDialog(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error) => {
      setResultMessage({ type: 'error', text: `Failed to reset database: ${error.message}` });
      setShowConfirmDialog(false);
    },
  });

  const handleResetDatabase = () => {
    setResultMessage(null);
    resetMutation.mutate();
  };

  return (
    <div className="flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm h-full lg:p-6 p-4">
      <div className="flex-1 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          </div>

          <div className="space-y-6">
  

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Database</h3>
              <p className="text-gray-600 text-sm mb-4">
                This will delete all existing data and reseed the database with demo data.
              </p>

              <Button
                variant="primary"
                onClick={() => setShowConfirmDialog(true)}
                disabled={resetMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {resetMutation.isPending ? 'Resetting...' : 'Reset Database'}
              </Button>
            </div>

            {resultMessage && (
              <div
                className={`rounded-lg p-4 ${
                  resultMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {resultMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleResetDatabase}
        title="Reset Database?"
        description="This will permanently delete all data and reseed with demo data. This action cannot be undone."
        confirmText="Yes, Reset Database"
        cancelText="Cancel"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={resetMutation.isPending}
        loadingText="Resetting..."
      />
    </div>
  );
}
