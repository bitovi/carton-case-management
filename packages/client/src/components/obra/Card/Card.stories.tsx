import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
import { Button } from '@/components/obra/Button';
import { Input } from '@/components/obra/Input';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Obra/Card',
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288-122714&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// =============================================================================
// FIGMA SLOT VARIANTS
// =============================================================================

/**
 * 1 Slot - Simple card with content only
 * @figma node-id=55:4701
 */
export const OneSlot: Story = {
  name: '1 Slot',
  render: () => (
    <Card className="w-[400px]">
      <CardContent className="pt-6">
        <p>Simple content in a card with a single slot.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * 2 Slots - Card with header and content
 * @figma node-id=179:29232
 */
export const TwoSlots: Story = {
  name: '2 Slots',
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This card has a header slot and a content slot.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content goes here.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * 3 Slots - Card with header, content, and footer
 * @figma node-id=179:29233
 */
export const ThreeSlots: Story = {
  name: '3 Slots',
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This card has header, content, and footer slots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Action</Button>
      </CardFooter>
    </Card>
  ),
};

// =============================================================================
// FIGMA EXAMPLES
// =============================================================================

/**
 * Contact Form - Example from Figma
 * @figma node-id=288:131164
 */
export const ContactForm: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Contact us</CardTitle>
        <CardDescription>
          Contact us and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Name</label>
          <Input placeholder="Enter your name..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">E-mail address</label>
          <Input placeholder="Enter your e-mail address..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Category</label>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option>Choose a category</option>
            <option>Support</option>
            <option>Sales</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Message</label>
          <textarea
            className="flex min-h-[76px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
            placeholder="Type your message here."
          />
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * Login Form - Example from Figma
 * @figma node-id=288:131167
 */
export const LoginForm: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-7">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <a href="#" className="text-sm">
              Forgot your password?
            </a>
          </div>
          <Input type="password" />
        </div>
        <div className="flex flex-col gap-3">
          <Button className="w-full">Login</Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <a href="#" className="underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  ),
};

/**
 * Image Card - Example from Figma
 * @figma node-id=288:131165
 */
export const ImageCard: Story = {
  render: () => (
    <Card className="w-[400px] overflow-hidden">
      <CardHeader>
        <CardTitle>Is this an image?</CardTitle>
        <CardDescription>This is a card with an image.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-muted-foreground">Image placeholder</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold">
            Label
          </span>
          <span className="inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold">
            Label
          </span>
          <span className="inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold">
            Label
          </span>
        </div>
        <span className="font-semibold">$135,000</span>
      </CardFooter>
    </Card>
  ),
};

/**
 * Meeting Notes - Example from Figma
 * @figma node-id=288:166985
 */
export const MeetingNotes: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Meeting Notes</CardTitle>
        <CardDescription>January 9, 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-sm">
          <p className="mb-3">
            Client requested dashboard redesign with focus on mobile
            responsiveness.
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>New analytics widgets for daily/weekly metrics</li>
            <li>Simplified navigation menu</li>
            <li>Dark mode support</li>
            <li>Timeline: 6 weeks</li>
            <li>Follow-up meeting scheduled for next Tuesday</li>
          </ol>
        </div>
        <div className="flex items-center -space-x-2">
          <div className="size-8 rounded-full bg-gray-200 border-2 border-white" />
          <div className="size-8 rounded-full bg-gray-300 border-2 border-white" />
          <div className="size-8 rounded-full bg-gray-400 border-2 border-white" />
        </div>
      </CardContent>
    </Card>
  ),
};

// =============================================================================
// DEFAULT STORY
// =============================================================================

/**
 * Default card composition
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>
          Deploy your new project in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="framework" className="text-sm font-medium">
                Framework
              </label>
              <select
                id="framework"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option>Select</option>
                <option>Next.js</option>
                <option>SvelteKit</option>
                <option>Astro</option>
                <option>Nuxt.js</option>
              </select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

// =============================================================================
// ADDITIONAL VARIANTS
// =============================================================================

/**
 * Card with custom width
 */
export const FullWidth: Story = {
  render: () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Full Width Card</CardTitle>
        <CardDescription>
          This card expands to full width with a max-width constraint.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content can be any width.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Minimal card without shadows
 */
export const Minimal: Story = {
  render: () => (
    <Card className="w-[400px] shadow-none">
      <CardContent className="pt-6">
        <p className="text-muted-foreground">
          A minimal card without shadow, useful for flat designs.
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * Interactive card with hover state
 */
export const Interactive: Story = {
  render: () => (
    <Card className="w-[400px] cursor-pointer transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the shadow effect.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Click me to do something.</p>
      </CardContent>
    </Card>
  ),
};
