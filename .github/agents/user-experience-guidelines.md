# User Experience Guidelines

**Canonical Reference:** [CasePage](../../packages/client/src/pages/CasePage) implementation

## 1. Sidebar Lists

**Reference:** [CaseList.tsx](../../packages/client/src/components/CaseList/CaseList.tsx)

### Required Elements
- Create button at top: `navigate('/entity/new')`
- Width: `lg:w-[200px]`
- Active state: Compare `activeId` from `useParams()` with item id
- Active styling: `bg-[#e8feff]`
- Hover styling: `hover:bg-gray-100`
- Truncate long text: `truncate` class
- Include loading/error/empty states (see section 6)

### Mobile
- Hide on mobile: `hidden lg:block`
- Show in Sheet overlay with `onCaseClick` callback to close

---

## 2. Inline Editing

### Components
- **Single-line text:** [EditableTitle](../../packages/client/src/components/common/EditableTitle/EditableTitle.tsx)
- **Dropdowns:** [EditableSelect](../../packages/client/src/components/common/EditableSelect/EditableSelect.tsx)
- **Multi-line text:** Custom with Textarea + Save/Cancel buttons

### Usage
```tsx
// Title/heading
<EditableTitle value={data.title} onSave={handleSave} isLoading={isPending} />

// Dropdown - inline mode
<EditableSelect value={data.field} options={OPTIONS} onChange={handleChange} />

// Dropdown - always editing (for badges)
<EditableSelect value={data.status} options={OPTIONS} onChange={handleChange} alwaysEditing />

// Textarea
{!editing ? <p onClick={() => setEditing(true)}>{text}</p> : <Textarea with Save/Cancel />}
```

### Mutation Pattern
```tsx
const mutation = trpc.entity.update.useMutation({
  onMutate: async (variables) => {
    await utils.entity.getById.cancel({ id });
    const previous = utils.entity.getById.getData({ id });
    if (previous) utils.entity.getById.setData({ id }, { ...previous, ...variables });
    return { previous };
  },
  onSuccess: () => {
    utils.entity.getById.invalidate({ id });
    utils.entity.list.invalidate();
  },
  onError: (err, vars, context) => {
    if (context?.previous) utils.entity.getById.setData({ id }, context.previous);
  },
});
```

---

## 3. Delete with Confirmation

**Reference:** [CaseInformation.tsx](../../packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.tsx), [ConfirmationDialog.tsx](../../packages/client/src/components/common/ConfirmationDialog/ConfirmationDialog.tsx)

### Pattern
```tsx
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

const deleteEntity = trpc.entity.delete.useMutation({
  onSuccess: () => {
    utils.entity.list.invalidate();
    navigate('/entities/');
  },
});

// Trigger (usually in DropdownMenu)
<DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
  <Trash /> Delete Entity
</DropdownMenuItem>

// Dialog
<ConfirmationDialog
  open={isDeleteDialogOpen}
  onOpenChange={setIsDeleteDialogOpen}
  onConfirm={() => deleteEntity.mutate({ id })}
  title="Delete Entity"
  description="Are you sure? This cannot be undone."
  confirmText="Delete"
  confirmClassName="bg-red-600 hover:bg-red-700"
  isLoading={deleteEntity.isPending}
/>
```

---

## 4. Create Form

**Reference:** [CreateCasePage.tsx](../../packages/client/src/pages/CreateCasePage/CreateCasePage.tsx)

### Routing
- Route: `/entities/:id` where `id` can be `'new'`
- Conditional render: `{id === 'new' ? <CreatePage /> : <DetailPage />}`
- Create button: `onClick={() => navigate('/entities/new')}`

### Form State
```tsx
const [field, setField] = useState('');
const [validationErrors, setValidationErrors] = useState({});
const [touched, setTouched] = useState(new Set());

const createEntity = trpc.entity.create.useMutation({
  onSuccess: (data) => {
    utils.entity.list.invalidate();
    navigate(`/entities/${data.id}`);
  },
});

const handleSubmit = (e) => {
  e.preventDefault();
  setTouched(new Set(['field1', 'field2']));
  if (!validate()) return;
  createEntity.mutate({ field });
};
```

### Validation
- Track touched fields: `touched.has(fieldName)`
- Show errors only for touched fields
- Validate on blur and submit
- Red border: `className={touched.has('field') && errors.field ? 'border-red-500' : ''}`

---

## 5. Responsive Design

### Breakpoint
- Mobile: default styles
- Desktop: `lg:` prefix (≥ 1024px)

### Sidebar Pattern
```tsx
const [isSheetOpen, setIsSheetOpen] = useState(false);

// Desktop sidebar
<div className="hidden lg:block"><EntityList /></div>

// Mobile sheet
<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
  <EntityList onItemClick={() => setIsSheetOpen(false)} />
</Sheet>

// Menu button for mobile
<Button onClick={() => setIsSheetOpen(true)} className="lg:hidden">
  <List />
</Button>
```

---

## 6. States (Loading/Error/Empty)

### Loading
```tsx
if (isLoading) return (
  <Skeleton className="h-5 w-3/4" />
  // Match final content shape
);
```

### Error
```tsx
if (error) return (
  <>
    <p className="text-red-600">Error: {error.message}</p>
    <Button onClick={() => refetch()}>Retry</Button>
  </>
);
```

### Empty
```tsx
if (!data || data.length === 0) return (
  <p className="text-gray-500">No items found</p>
);
```

---

## Implementation Checklist

- [ ] Sidebar list: 200px, create button, active states, mobile sheet
- [ ] Inline editing: Use EditableTitle/EditableSelect components
- [ ] Delete: ConfirmationDialog with red styling
- [ ] Create: Form at `/entity/new` with validation and touched state
- [ ] Optimistic updates: onMutate/onError rollback pattern
- [ ] Responsive: Mobile sheet overlay, desktop always visible
- [ ] States: Loading skeletons, error retry, empty messaging
- [ ] Navigation: To list after delete, to detail after create
- [ ] Cache: Invalidate list.invalidate() and getById.invalidate()
