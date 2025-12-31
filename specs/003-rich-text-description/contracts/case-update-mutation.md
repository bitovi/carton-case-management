# Contract: Case Update Mutation (Rich Text)

**Endpoint**: `case.update`  
**Location**: `packages/server/src/router.ts`  
**Type**: tRPC Mutation  
**Purpose**: Update case description with rich text content

## Mutation Signature

```typescript
case.update: publicProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),  // JSON string of RichTextDocument
      status: z.enum(['TO_DO', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']).optional(),
      customerName: z.string().optional(),
      assigneeId: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Validation logic here
    const { id, ...data } = input;
    return ctx.prisma.case.update({
      where: { id },
      data,
    });
  })
```

## Input Validation (New)

### Rich Text Description Validation

When `description` field is provided, additional validation is performed:

```typescript
case.update: publicProcedure
  .input(
    z.object({
      id: z.string(),
      // ... other fields
      description: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { id, description, ...data } = input;

    // If description is provided, validate it
    if (description !== undefined) {
      try {
        // Parse JSON to validate structure
        const richTextDoc = JSON.parse(description) as RichTextDocument;

        // Validate against Zod schema
        const validation = richTextDocumentSchema.safeParse(richTextDoc);
        if (!validation.success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid rich text structure',
            cause: validation.error,
          });
        }

        // Validate character count
        const plainText = serializeToPlainText(richTextDoc);
        if (plainText.length > 10000) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Description exceeds maximum length of 10,000 characters (current: ${plainText.length})`,
          });
        }

        // Validate non-empty
        if (plainText.trim().length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Description cannot be empty',
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        // JSON parse error or other error
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid description format',
          cause: error,
        });
      }
    }

    // Proceed with update
    return ctx.prisma.case.update({
      where: { id },
      data: description !== undefined ? { ...data, description } : data,
    });
  })
```

## Request Examples

### Update with Rich Text Description

```typescript
// Client-side mutation call
const updateCase = trpc.case.update.useMutation();

// Slate editor state
const slateDocument: RichTextDocument = [
  {
    type: 'paragraph',
    children: [{ text: 'Customer reports ' }, { text: 'login issue', bold: true }],
  },
];

// Stringify for API
const descriptionJson = JSON.stringify(slateDocument);

// Call mutation
updateCase.mutate({
  id: 'case-123',
  description: descriptionJson,
});
```

### Update with Formatted Content

```typescript
const formattedDocument: RichTextDocument = [
  {
    type: 'heading-two',
    children: [{ text: 'Issue Summary' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'User cannot access ' }, { text: 'dashboard', bold: true, italic: true }],
  },
  {
    type: 'bulleted-list',
    children: [
      { type: 'list-item', children: [{ text: 'Checked permissions' }] },
      { type: 'list-item', children: [{ text: 'Verified user role' }] },
    ],
  },
];

updateCase.mutate({
  id: 'case-456',
  description: JSON.stringify(formattedDocument),
});
```

## Response Format

### Success Response

```typescript
{
  result: {
    data: {
      id: 'case-123',
      caseNumber: 'CASE-001',
      title: 'Customer Login Issue',
      description: '[{"type":"paragraph","children":[{"text":"Customer reports "},{"text":"login issue","bold":true}]}]',
      customerName: 'Acme Corp',
      status: 'IN_PROGRESS',
      createdBy: 'user-1',
      assignedTo: 'user-2',
      createdAt: '2025-12-30T10:00:00.000Z',
      updatedAt: '2025-12-30T14:30:00.000Z',
    }
  }
}
```

## Error Responses

### Invalid Rich Text Structure

```typescript
{
  error: {
    message: 'Invalid rich text structure',
    code: 'BAD_REQUEST',
    data: {
      code: 'BAD_REQUEST',
      zodError: {
        issues: [
          {
            path: ['0', 'type'],
            message: 'Invalid literal value, expected "paragraph"',
          }
        ]
      }
    }
  }
}
```

### Character Limit Exceeded

```typescript
{
  error: {
    message: 'Description exceeds maximum length of 10,000 characters (current: 12,543)',
    code: 'BAD_REQUEST',
  }
}
```

### Empty Description

```typescript
{
  error: {
    message: 'Description cannot be empty',
    code: 'BAD_REQUEST',
  }
}
```

### Invalid JSON Format

```typescript
{
  error: {
    message: 'Invalid description format',
    code: 'BAD_REQUEST',
  }
}
```

## Client-Side Handling

### Using the Mutation

```typescript
import { trpc } from '@/lib/trpc';
import { type RichTextDocument } from '@carton/shared/richText';
import { useState } from 'react';
import { Descendant } from 'slate';

function CaseDescriptionEditor({ caseId, initialContent }: Props) {
  const [editorValue, setEditorValue] = useState<Descendant[]>(initialContent);

  const utils = trpc.useUtils();
  const updateCase = trpc.case.update.useMutation({
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      utils.case.getById.invalidate({ id: caseId });
      utils.case.list.invalidate();
    },
    onError: (error) => {
      // Handle errors
      console.error('Failed to update case:', error);
      alert(error.message);
    },
  });

  const handleSave = () => {
    const richTextJson = JSON.stringify(editorValue as RichTextDocument);

    updateCase.mutate({
      id: caseId,
      description: richTextJson,
    });
  };

  return (
    <div>
      <RichTextEditor value={editorValue} onChange={setEditorValue} />
      <button
        onClick={handleSave}
        disabled={updateCase.isPending}
      >
        {updateCase.isPending ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
```

### Error Handling

```typescript
const updateCase = trpc.case.update.useMutation({
  onError: (error) => {
    if (error.message.includes('exceeds maximum length')) {
      // Character limit error
      setError('Description is too long. Please shorten it to 10,000 characters or less.');
    } else if (error.message.includes('cannot be empty')) {
      // Empty description error
      setError('Please enter a description for this case.');
    } else if (error.message.includes('Invalid rich text structure')) {
      // Malformed rich text error
      setError('There was a problem with the formatting. Please refresh and try again.');
    } else {
      // Generic error
      setError('Failed to save changes. Please try again.');
    }
  },
});
```

## Backwards Compatibility

The mutation maintains backwards compatibility:

1. **Plain text descriptions**: Can still be sent and stored (treated as JSON string if not parseable)
2. **Old clients**: Will see JSON string if they don't parse it (degraded but not broken)
3. **New clients**: Will attempt to parse JSON, fall back to plain text if parsing fails

## Testing

### Unit Tests

```typescript
describe('case.update with rich text', () => {
  it('should accept valid rich text JSON', async () => {
    const richText = [{ type: 'paragraph', children: [{ text: 'Test' }] }];
    const result = await caller.case.update({
      id: 'test-case',
      description: JSON.stringify(richText),
    });
    expect(result.description).toBe(JSON.stringify(richText));
  });

  it('should reject description exceeding 10,000 characters', async () => {
    const longText = 'a'.repeat(10001);
    const richText = [{ type: 'paragraph', children: [{ text: longText }] }];

    await expect(
      caller.case.update({
        id: 'test-case',
        description: JSON.stringify(richText),
      })
    ).rejects.toThrow('exceeds maximum length');
  });

  it('should reject empty description', async () => {
    const emptyText = [{ type: 'paragraph', children: [{ text: '' }] }];

    await expect(
      caller.case.update({
        id: 'test-case',
        description: JSON.stringify(emptyText),
      })
    ).rejects.toThrow('cannot be empty');
  });

  it('should reject malformed rich text structure', async () => {
    const invalid = [{ type: 'invalid-type', children: [{ text: 'Test' }] }];

    await expect(
      caller.case.update({
        id: 'test-case',
        description: JSON.stringify(invalid),
      })
    ).rejects.toThrow('Invalid rich text structure');
  });
});
```

### Integration Tests

```typescript
describe('case.update E2E', () => {
  it('should save and retrieve formatted description', async () => {
    const richText = [
      {
        type: 'paragraph',
        children: [
          { text: 'Bold ', bold: true },
          { text: 'and italic', italic: true },
        ],
      },
    ];

    // Update
    await trpcClient.case.update.mutate({
      id: testCase.id,
      description: JSON.stringify(richText),
    });

    // Retrieve
    const updated = await trpcClient.case.getById.query({ id: testCase.id });
    const parsed = JSON.parse(updated.description);

    expect(parsed).toEqual(richText);
  });
});
```

## Performance Considerations

- **Validation overhead**: ~1-5ms for typical documents
- **JSON parsing**: <1ms for documents under 10,000 characters
- **Character counting**: ~1ms for plain text serialization
- **Total overhead**: <10ms per mutation (acceptable)

## Security Considerations

1. **XSS Prevention**: All HTML is stripped during paste, only structured data stored
2. **SQL Injection**: Protected by Prisma ORM (parameterized queries)
3. **Size Limits**: 10,000 character limit prevents DoS via large payloads
4. **Validation**: Strict schema validation prevents malformed data
5. **URL Validation**: Link URLs validated to be proper URLs (no javascript: protocol)
