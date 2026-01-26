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

