import figma from '@figma/code-connect';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip';

/**
 * Figma Code Connect for Tooltip component
 *
 * Maps Figma variants to React component props:
 * - Side: Top | Right | Bottom | Left → side prop
 */
figma.connect(TooltipContent, 'https://www.figma.com/design/PJL27n1U1OF2FrlPVfVi2Q?node-id=274:57607', {
  props: {
    side: figma.enum('Side', {
      Top: 'top',
      Right: 'right',
      Bottom: 'bottom',
      Left: 'left',
    }),
  },
  example: ({ side }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent side={side}>Tooltip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
});
