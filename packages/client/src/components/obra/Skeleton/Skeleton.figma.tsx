import figma from '@figma/code-connect';
import { Skeleton } from './Skeleton';

// Code Connect mapping for SkeletonPlaceholderLine
figma.connect(
  Skeleton,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=222:27481',
  {
    props: {},
    example: () => <Skeleton variant="line" className="w-64" />,
  }
);

// Code Connect mapping for SkeletonPlaceholderObject
figma.connect(
  Skeleton,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=222:27487',
  {
    props: {},
    example: () => <Skeleton variant="object" className="h-32 w-64" />,
  }
);

// Code Connect mapping for SkeletonPlaceholderAvatar
figma.connect(
  Skeleton,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=222:27480',
  {
    props: {},
    example: () => <Skeleton variant="avatar" size="md" />,
  }
);

// Code Connect mapping for Skeleton (composite)
figma.connect(
  Skeleton,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=222:27489',
  {
    props: {},
    example: () => (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="space-y-2">
            <Skeleton variant="line" className="w-64" />
            <Skeleton variant="line" className="w-48" />
          </div>
        </div>
        <Skeleton variant="object" className="h-32 w-full" />
      </div>
    ),
  }
);
