# Lucide to Kendo SVG Icon Mapping

This document maps all Lucide icons used in the codebase to their Kendo SVG icon equivalents.

## Import Pattern

```typescript
// Lucide pattern
import { Check, X, Plus } from 'lucide-react';

// Kendo pattern
import { checkIcon, xIcon, plusIcon } from '@progress/kendo-svg-icons';
```

## Usage Pattern

```typescript
// Lucide usage (component-based)
<Check className="h-4 w-4" />

// Kendo usage (SVG icon objects)
import { SvgIcon } from '@progress/kendo-react-common';
<SvgIcon icon={checkIcon} size="small" /> // or "medium", "large", or custom themeColor
```

## Complete Icon Mapping

### Navigation & Layout

| Lucide Icon    | Kendo SVG Icon      | Import                                                          | Notes                                   |
| -------------- | ------------------- | --------------------------------------------------------------- | --------------------------------------- |
| `ChevronDown`  | `caretAltDownIcon`  | `import { caretAltDownIcon } from '@progress/kendo-svg-icons'`  | Used for dropdowns, selects, accordions |
| `ChevronUp`    | `caretAltUpIcon`    | `import { caretAltUpIcon } from '@progress/kendo-svg-icons'`    | Used in select components               |
| `ChevronLeft`  | `caretAltLeftIcon`  | `import { caretAltLeftIcon } from '@progress/kendo-svg-icons'`  | Calendar navigation                     |
| `ChevronRight` | `caretAltRightIcon` | `import { caretAltRightIcon } from '@progress/kendo-svg-icons'` | Calendar navigation                     |

### Actions

| Lucide Icon        | Kendo SVG Icon | Import                                                     | Notes                            |
| ------------------ | -------------- | ---------------------------------------------------------- | -------------------------------- |
| `Check`            | `checkIcon`    | `import { checkIcon } from '@progress/kendo-svg-icons'`    | Checkboxes, confirmation, badges |
| `X`                | `xIcon`        | `import { xIcon } from '@progress/kendo-svg-icons'`        | Close buttons, cancel actions    |
| `Plus`             | `plusIcon`     | `import { plusIcon } from '@progress/kendo-svg-icons'`     | Add buttons                      |
| `Minus`            | `minusIcon`    | `import { minusIcon } from '@progress/kendo-svg-icons'`    | Indeterminate checkbox state     |
| `Edit2`            | `pencilIcon`   | `import { pencilIcon } from '@progress/kendo-svg-icons'`   | Edit actions                     |
| `Trash` / `Trash2` | `trashIcon`    | `import { trashIcon } from '@progress/kendo-svg-icons'`    | Delete actions                   |
| `Download`         | `downloadIcon` | `import { downloadIcon } from '@progress/kendo-svg-icons'` | Download button                  |
| `Share2`           | `shareIcon`    | `import { shareIcon } from '@progress/kendo-svg-icons'`    | Share action                     |

### Status & Feedback

| Lucide Icon   | Kendo SVG Icon          | Import                                                              | Notes                              |
| ------------- | ----------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| `AlertCircle` | `exclamationCircleIcon` | `import { exclamationCircleIcon } from '@progress/kendo-svg-icons'` | Alerts, warnings                   |
| `Info`        | `infoCircleIcon`        | `import { infoCircleIcon } from '@progress/kendo-svg-icons'`        | Information alerts                 |
| `Loader2`     | `clockArrowRotateIcon`  | `import { clockArrowRotateIcon } from '@progress/kendo-svg-icons'`  | Loading states (animate with spin) |

### User & Content

| Lucide Icon     | Kendo SVG Icon    | Import                                                        | Notes                          |
| --------------- | ----------------- | ------------------------------------------------------------- | ------------------------------ |
| `User`          | `userIcon`        | `import { userIcon } from '@progress/kendo-svg-icons'`        | Single user icon               |
| `UserCircle`    | `userIcon`        | `import { userIcon } from '@progress/kendo-svg-icons'`        | Use same as User               |
| `Users`         | `tellAFriendIcon` | `import { tellAFriendIcon } from '@progress/kendo-svg-icons'` | Multiple users (closest match) |
| `Mail`          | `envelopeIcon`    | `import { envelopeIcon } from '@progress/kendo-svg-icons'`    | Email/mail icon                |
| `MessageSquare` | `commentIcon`     | `import { commentIcon } from '@progress/kendo-svg-icons'`     | Chat/comment icon              |

### Navigation Icons

| Lucide Icon    | Kendo SVG Icon | Import                                                   | Notes                 |
| -------------- | -------------- | -------------------------------------------------------- | --------------------- |
| `Home`         | `homeIcon`     | `import { homeIcon } from '@progress/kendo-svg-icons'`   | Home navigation       |
| `Settings`     | `gearIcon`     | `import { gearIcon } from '@progress/kendo-svg-icons'`   | Settings icon         |
| `FolderClosed` | `folderIcon`   | `import { folderIcon } from '@progress/kendo-svg-icons'` | Folder/directory icon |

### Form & Input

| Lucide Icon  | Kendo SVG Icon | Import                                                     | Notes            |
| ------------ | -------------- | ---------------------------------------------------------- | ---------------- |
| `Search`     | `searchIcon`   | `import { searchIcon } from '@progress/kendo-svg-icons'`   | Search input     |
| `Calendar`   | `calendarIcon` | `import { calendarIcon } from '@progress/kendo-svg-icons'` | Date picker      |
| `DollarSign` | `dollarIcon`   | `import { dollarIcon } from '@progress/kendo-svg-icons'`   | Currency input   |
| `Percent`    | `percentIcon`  | `import { percentIcon } from '@progress/kendo-svg-icons'`  | Percentage input |
| `ListFilter` | `filterIcon`   | `import { filterIcon } from '@progress/kendo-svg-icons'`   | Filter trigger   |

### Menu & Actions

| Lucide Icon    | Kendo SVG Icon     | Import                                                         | Notes                      |
| -------------- | ------------------ | -------------------------------------------------------------- | -------------------------- |
| `MoreVertical` | `moreVerticalIcon` | `import { moreVerticalIcon } from '@progress/kendo-svg-icons'` | More options menu          |
| `Star`         | `starIcon`         | `import { starIcon } from '@progress/kendo-svg-icons'`         | Star/favorite icon         |
| `ThumbsUp`     | `thumbsUpIcon`     | `import { thumbsUpIcon } from '@progress/kendo-svg-icons'`     | Like/upvote                |
| `ThumbsDown`   | `thumbsDownIcon`   | `import { thumbsDownIcon } from '@progress/kendo-svg-icons'`   | Dislike/downvote           |
| `Bot`          | `userIcon`         | `import { userIcon } from '@progress/kendo-svg-icons'`         | User icon (for Users menu) |

## Size Mapping

Kendo SvgIcon supports size prop values: `"small"`, `"medium"`, `"large"`, or custom size strings.

Common Lucide size classes and their Kendo equivalents:

| Lucide className | Kendo size | Notes           |
| ---------------- | ---------- | --------------- |
| `h-3 w-3`        | `"small"`  | 16px equivalent |
| `h-4 w-4`        | `"small"`  | 16px equivalent |
| `h-5 w-5`        | `"medium"` | 24px equivalent |
| `h-6 w-6`        | `"medium"` | 24px equivalent |
| `h-8 w-8`        | `"large"`  | 32px equivalent |

## Implementation Notes

1. **Import SvgIcon wrapper**: Most usage will require `import { SvgIcon } from '@progress/kendo-react-common'`
2. **Icon objects**: Kendo icons are imported as objects (e.g., `checkIcon`), not components
3. **Styling**: Use `size` prop for dimensions and `themeColor` for color (or className for custom)
4. **Semantic equivalence**: Some icons are not pixel-perfect matches but serve the same purpose
5. **Default size**: If no size is specified, `"medium"` is the default

## References

- [Kendo SVG Icons Documentation](https://www.telerik.com/kendo-react-ui/components/styling/svg-icons/)
- [Kendo Icon List](https://www.telerik.com/kendo-react-ui/components/styling/icons/icon-list/)
