import figma from '@figma/code-connect';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './index';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=133:14788',
  {
  props: {
    side: figma.enum('Side', {
      Top: 'top',
      Bottom: 'bottom',
      Left: 'left',
      Right: 'right',
    }),
  },

  example: ({ side }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent side={side}>
          Tooltip text
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
);

// Riot Training version
// NOTE: Config must be duplicated inline - Figma Code Connect requires object literals.
// This connection will be removed once Riot training is complete.
figma.connect(
  Tooltip,
  'https://www.figma.com/design/W2OPvGxXCtbFPP8wYxezX1/Riot-Games-Obra-shadcn-ui?node-id=133-14788',
  {
  props: {
    side: figma.enum('Side', {
      Top: 'top',
      Bottom: 'bottom',
      Left: 'left',
      Right: 'right',
    }),
  },

  example: ({ side }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent side={side}>
          Tooltip text
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
);

