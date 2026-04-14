export interface CustomerListDialogContentProps {
  customers: { id: string; firstName: string; lastName: string }[] | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  searchQuery: string;
  onRetry: () => void;
  onDeleteClick: (id: string, firstName: string, lastName: string) => void;
}
