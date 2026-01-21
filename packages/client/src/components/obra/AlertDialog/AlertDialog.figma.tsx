import figma from '@figma/code-connect';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog';

/**
 * Code Connect mapping for the Obra AlertDialog component.
 *
 * Maps Figma variants to React props for the AlertDialog component.
 *
 * Figma URL: https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=295-239548&m=dev
 */

// AlertDialog Content - Type variant
figma.connect(
  AlertDialogContent,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=139:11939',
  {
    props: {
      variant: figma.enum('Type', {
        Mobile: 'mobile',
        Desktop: 'desktop',
      }),
      title: figma.textContent('Title'),
      description: figma.textContent('Text'),
    },
    example: ({ variant, title, description }) => (
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent variant={variant}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  }
);
