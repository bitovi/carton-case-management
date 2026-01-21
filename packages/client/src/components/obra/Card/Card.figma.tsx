import figma from '@figma/code-connect';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

/**
 * Card - 1 Slot variant
 * Simple card with content only
 */
figma.connect(
  Card,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=55:4701',
  {
    variant: { 'Slot No.': '1 Slot' },
    props: {
      mainSlot: figma.children('*'),
    },
    example: ({ mainSlot }) => (
      <Card>
        <CardContent className="pt-6">{mainSlot}</CardContent>
      </Card>
    ),
  }
);

/**
 * Card - 2 Slots variant
 * Card with header and content
 */
figma.connect(
  Card,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=179:29232',
  {
    variant: { 'Slot No.': '2 Slots' },
    props: {
      headerSlot: figma.children('.Slot'),
      mainSlot: figma.children('.Slot'),
    },
    example: ({ headerSlot, mainSlot }) => (
      <Card>
        <CardHeader>{headerSlot}</CardHeader>
        <CardContent>{mainSlot}</CardContent>
      </Card>
    ),
  }
);

/**
 * Card - 3 Slots variant
 * Card with header, content, and footer
 */
figma.connect(
  Card,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=179:29233',
  {
    variant: { 'Slot No.': '3 Slots' },
    props: {
      headerSlot: figma.children('.Slot'),
      mainSlot: figma.children('.Slot'),
      footerSlot: figma.children('.Slot'),
    },
    example: ({ headerSlot, mainSlot, footerSlot }) => (
      <Card>
        <CardHeader>{headerSlot}</CardHeader>
        <CardContent>{mainSlot}</CardContent>
        <CardFooter>{footerSlot}</CardFooter>
      </Card>
    ),
  }
);

/**
 * Card Header Default - Header slot content
 * Used within Card components for title and description
 */
figma.connect(
  CardHeader,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=179:30184',
  {
    props: {
      title: figma.textContent('title'),
      description: figma.textContent('description'),
    },
    example: ({ title, description }) => (
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    ),
  }
);

/**
 * Contact Form Example
 */
figma.connect(
  Card,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288:131164',
  {
    props: {},
    example: () => (
      <Card>
        <CardHeader>
          <CardTitle>Contact us</CardTitle>
          <CardDescription>
            Contact us and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>{/* Form fields */}</CardContent>
      </Card>
    ),
  }
);

/**
 * Login Form Example
 */
figma.connect(
  Card,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288:131167',
  {
    props: {},
    example: () => (
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>{/* Login form fields */}</CardContent>
        <CardFooter>
          <p>Don't have an account? Sign up</p>
        </CardFooter>
      </Card>
    ),
  }
);

/**
 * Image Card Example
 */
figma.connect(
  Card,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288:131165',
  {
    props: {},
    example: () => (
      <Card>
        <CardHeader>
          <CardTitle>Is this an image?</CardTitle>
          <CardDescription>This is a card with an image.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <img src="..." alt="..." className="w-full" />
        </CardContent>
        <CardFooter className="justify-between">
          {/* Badges */}
          <span className="font-semibold">$135,000</span>
        </CardFooter>
      </Card>
    ),
  }
);

/**
 * Meeting Notes Example
 */
figma.connect(
  Card,
  'https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288:166985',
  {
    props: {},
    example: () => (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Notes</CardTitle>
          <CardDescription>January 9, 2024</CardDescription>
        </CardHeader>
        <CardContent>{/* Meeting notes content */}</CardContent>
      </Card>
    ),
  }
);
