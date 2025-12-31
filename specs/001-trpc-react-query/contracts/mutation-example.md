# tRPC React Query - Mutation Example

This file demonstrates the standard pattern for creating/updating data using tRPC + React Query.

## Component: CreateCaseForm.tsx

```typescript
import { trpc } from '../lib/trpc';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component that creates a new case
 * Demonstrates: useMutation hook, loading states, error handling, cache invalidation
 */
export function CreateCaseForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Get utils for cache invalidation
  const utils = trpc.useUtils();
  
  // ✅ Define mutation with success/error callbacks
  const createCase = trpc.case.create.useMutation({
    onSuccess: (newCase) => {
      // Invalidate case list to trigger refetch
      utils.case.list.invalidate();
      
      // Navigate to the new case
      navigate(`/cases/${newCase.id}`);
      
      // Show success message (if you have a toast system)
      console.log('Case created successfully!');
    },
    onError: (error) => {
      // Handle error (show toast, log, etc.)
      console.error('Failed to create case:', error);
      alert(`Error: ${error.message}`);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    // Trigger mutation
    createCase.mutate({
      title: title.trim(),
      description: description.trim(),
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Case</h1>
      
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 font-medium">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={createCase.isLoading}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={createCase.isLoading}
          className="w-full px-3 py-2 border rounded"
          rows={5}
        />
      </div>
      
      {/* Show error message if mutation failed */}
      {createCase.isError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          Error: {createCase.error.message}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={createCase.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createCase.isLoading ? 'Creating...' : 'Create Case'}
        </button>
        
        <button
          type="button"
          onClick={() => navigate('/cases')}
          disabled={createCase.isLoading}
          className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

## Update Mutation

```typescript
import { trpc } from '../lib/trpc';
import { useState } from 'react';

/**
 * Component that updates an existing case
 * Demonstrates: mutation with input, optimistic updates
 */
export function EditCaseForm({ caseId }: { caseId: string }) {
  const utils = trpc.useUtils();
  
  // Fetch current case data
  const { data: caseItem } = trpc.case.getById.useQuery({ id: caseId });
  
  const [title, setTitle] = useState(caseItem?.title ?? '');
  const [status, setStatus] = useState(caseItem?.status ?? 'OPEN');
  
  // Update mutation with optimistic update
  const updateCase = trpc.case.update.useMutation({
    // Optimistic update - update UI immediately before server responds
    onMutate: async (updatedData) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await utils.case.getById.cancel({ id: caseId });
      
      // Snapshot the previous value
      const previousCase = utils.case.getById.getData({ id: caseId });
      
      // Optimistically update to the new value
      utils.case.getById.setData({ id: caseId }, (old) => 
        old ? { ...old, ...updatedData } : old
      );
      
      // Return context with snapshot
      return { previousCase };
    },
    
    // If mutation fails, rollback to previous value
    onError: (err, updatedData, context) => {
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
      alert(`Update failed: ${err.message}`);
    },
    
    // Always refetch after error or success
    onSettled: () => {
      utils.case.getById.invalidate({ id: caseId });
      utils.case.list.invalidate(); // Also invalidate list view
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCase.mutate({
      id: caseId,
      title,
      status,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={updateCase.isLoading}
      />
      
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        disabled={updateCase.isLoading}
      >
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="CLOSED">Closed</option>
      </select>
      
      <button type="submit" disabled={updateCase.isLoading}>
        {updateCase.isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
```

## Delete Mutation

```typescript
import { trpc } from '../lib/trpc';
import { useNavigate } from 'react-router-dom';

/**
 * Delete case button
 * Demonstrates: mutation without input, confirmation, redirect after success
 */
export function DeleteCaseButton({ caseId }: { caseId: string }) {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  
  const deleteCase = trpc.case.delete.useMutation({
    onSuccess: () => {
      // Invalidate list and redirect
      utils.case.list.invalidate();
      navigate('/cases');
    },
    onError: (error) => {
      alert(`Failed to delete case: ${error.message}`);
    },
  });
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this case?')) {
      deleteCase.mutate({ id: caseId });
    }
  };
  
  return (
    <button
      onClick={handleDelete}
      disabled={deleteCase.isLoading}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {deleteCase.isLoading ? 'Deleting...' : 'Delete Case'}
    </button>
  );
}
```

## Mutation with File Upload

```typescript
import { trpc } from '../lib/trpc';
import { useState } from 'react';

/**
 * Upload attachment to case
 * Demonstrates: mutation with complex input, progress handling
 */
export function UploadAttachment({ caseId }: { caseId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const utils = trpc.useUtils();
  
  const uploadAttachment = trpc.case.uploadAttachment.useMutation({
    onSuccess: () => {
      // Invalidate case to show new attachment
      utils.case.getById.invalidate({ id: caseId });
      setFile(null);
      alert('File uploaded successfully!');
    },
  });
  
  const handleUpload = async () => {
    if (!file) return;
    
    // Convert file to base64 (or use multipart upload if supported)
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      
      uploadAttachment.mutate({
        caseId,
        filename: file.name,
        contentType: file.type,
        data: base64,
      });
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        disabled={uploadAttachment.isLoading}
      />
      
      <button
        onClick={handleUpload}
        disabled={!file || uploadAttachment.isLoading}
      >
        {uploadAttachment.isLoading ? 'Uploading...' : 'Upload'}
      </button>
      
      {uploadAttachment.isLoading && (
        <div className="mt-2">
          <div className="text-sm text-gray-600">Uploading {file?.name}...</div>
          {/* Progress bar could go here if backend supports progress events */}
        </div>
      )}
    </div>
  );
}
```

## Async Mutation (Promise-based)

```typescript
import { trpc } from '../lib/trpc';

/**
 * Using mutateAsync for promise-based control flow
 * Useful when you need to wait for the result or chain operations
 */
export function AsyncMutationExample() {
  const utils = trpc.useUtils();
  const createCase = trpc.case.create.useMutation();
  
  const handleCreateMultiple = async () => {
    try {
      // Create multiple cases sequentially
      const case1 = await createCase.mutateAsync({ title: 'Case 1' });
      console.log('Created:', case1.id);
      
      const case2 = await createCase.mutateAsync({ title: 'Case 2' });
      console.log('Created:', case2.id);
      
      // All done - invalidate and show success
      await utils.case.list.invalidate();
      alert('All cases created successfully!');
    } catch (error) {
      console.error('Failed to create cases:', error);
      alert('Creation failed - some cases may not have been created');
    }
  };
  
  return (
    <button onClick={handleCreateMultiple} disabled={createCase.isLoading}>
      Create Multiple Cases
    </button>
  );
}
```

## Cache Invalidation Strategies

```typescript
import { trpc } from '../lib/trpc';

export function CacheInvalidationExamples() {
  const utils = trpc.useUtils();
  const updateCase = trpc.case.update.useMutation();
  
  // Strategy 1: Invalidate specific query
  const invalidateSpecific = () => {
    updateCase.mutate(
      { id: '123', title: 'Updated' },
      {
        onSuccess: () => {
          // Only invalidate this specific case
          utils.case.getById.invalidate({ id: '123' });
        },
      }
    );
  };
  
  // Strategy 2: Invalidate all queries of a type
  const invalidateAll = () => {
    updateCase.mutate(
      { id: '123', status: 'CLOSED' },
      {
        onSuccess: () => {
          // Invalidate all case queries (list, getById, etc.)
          utils.case.invalidate();
        },
      }
    );
  };
  
  // Strategy 3: Selective invalidation with refetch
  const selectiveInvalidate = () => {
    updateCase.mutate(
      { id: '123', title: 'Updated' },
      {
        onSuccess: async () => {
          // Invalidate list (will refetch if mounted)
          await utils.case.list.invalidate();
          
          // Manually refetch this specific case
          await utils.case.getById.refetch({ id: '123' });
        },
      }
    );
  };
  
  // Strategy 4: Update cache directly (no refetch)
  const updateCacheDirectly = () => {
    updateCase.mutate(
      { id: '123', title: 'New Title' },
      {
        onSuccess: (updatedCase) => {
          // Update the specific case cache
          utils.case.getById.setData({ id: '123' }, updatedCase);
          
          // Update the list cache manually
          utils.case.list.setData(undefined, (old) =>
            old?.map((c) => (c.id === '123' ? updatedCase : c))
          );
        },
      }
    );
  };
  
  return <div>See code for examples</div>;
}
```

## Error Handling Patterns

```typescript
import { trpc } from '../lib/trpc';
import { TRPCClientError } from '@trpc/client';

export function ErrorHandlingExample() {
  const createCase = trpc.case.create.useMutation({
    onError: (error) => {
      // Type-safe error handling
      if (error.data?.code === 'UNAUTHORIZED') {
        // Redirect to login
        window.location.href = '/login';
      } else if (error.data?.code === 'BAD_REQUEST') {
        // Show validation errors
        alert(`Validation error: ${error.message}`);
      } else {
        // Generic error
        alert('An unexpected error occurred');
      }
    },
  });
  
  const handleSubmit = async () => {
    try {
      await createCase.mutateAsync({ title: 'Test' });
    } catch (error) {
      // Error already handled in onError callback
      // But you can also handle it here if needed
      if (error instanceof TRPCClientError) {
        console.log('TRPC error code:', error.data?.code);
      }
    }
  };
  
  return <button onClick={handleSubmit}>Create</button>;
}
```

## Type Safety Benefits

```typescript
// ✅ Mutation input is fully typed
createCase.mutate({
  title: 'Test',
  description: 'Test desc',
  status: 'INVALID', // ❌ Error: Type '"INVALID"' is not assignable to type 'CaseStatus'
});

// ✅ Mutation result is fully typed
createCase.mutate({ title: 'Test' }, {
  onSuccess: (newCase) => {
    console.log(newCase.id); // ✅ OK - id exists on Case type
    console.log(newCase.invalidField); // ❌ Error: Property doesn't exist
  },
});

// ✅ Error is typed
createCase.mutate({ title: 'Test' }, {
  onError: (error) => {
    console.log(error.message); // ✅ OK - string
    console.log(error.data?.code); // ✅ OK - TRPC error code
  },
});
```

## Testing Example

See [test-example.test.tsx](./test-example.test.tsx) for how to test mutations.
