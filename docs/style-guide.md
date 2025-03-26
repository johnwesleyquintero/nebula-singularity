# Style Guide

## Color System

### Light Theme
```css
--background: 0 0% 100%
--foreground: 0 0% 3.9%
--card: 0 0% 100%
--card-foreground: 0 0% 3.9%
--popover: 0 0% 100%
--popover-foreground: 0 0% 3.9%
--primary: 0 0% 9%
--primary-foreground: 0 0% 98%
--secondary: 0 0% 96.1%
--secondary-foreground: 0 0% 9%
--muted: 0 0% 96.1%
--muted-foreground: 0 0% 45.1%
--accent: 0 0% 96.1%
--accent-foreground: 0 0% 9%
--destructive: 0 84.2% 60.2%
--destructive-foreground: 0 0% 98%
--border: 0 0% 89.8%
--input: 0 0% 89.8%
--ring: 0 0% 3.9%
```

### Dark Theme
```css
--background: 0 0% 3.9%
--foreground: 0 0% 98%
--card: 0 0% 3.9%
--card-foreground: 0 0% 98%
--popover: 0 0% 3.9%
--popover-foreground: 0 0% 98%
--primary: 0 0% 98%
--primary-foreground: 0 0% 9%
--secondary: 0 0% 14.9%
--secondary-foreground: 0 0% 98%
--muted: 0 0% 14.9%
--muted-foreground: 0 0% 63.9%
--accent: 0 0% 14.9%
--accent-foreground: 0 0% 98%
--destructive: 0 62.8% 30.6%
--destructive-foreground: 0 0% 98%
--border: 0 0% 14.9%
--input: 0 0% 14.9%
--ring: 0 0% 83.9%
```

### Chart Colors
```css
--chart-1: 12 76% 61%
--chart-2: 173 58% 39%
--chart-3: 197 37% 24%
--chart-4: 43 74% 66%
--chart-5: 27 87% 67%
```

### Sidebar Theme
```css
--sidebar-background: 0 0% 98%
--sidebar-foreground: 240 5.3% 26.1%
--sidebar-primary: 240 5.9% 10%
--sidebar-primary-foreground: 0 0% 98%
--sidebar-accent: 240 4.8% 95.9%
--sidebar-accent-foreground: 240 5.9% 10%
--sidebar-border: 220 13% 91%
--sidebar-ring: 217.2 91.2% 59.8%
```

## Typography

### Font Family
```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

## Layout

### Container
```js
container: {
  center: true,
  padding: "2rem",
  screens: {
    "2xl": "1400px",
  },
}
```

### Border Radius
```js
borderRadius: {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
}
```

## Animations

### Keyframes
```js
keyframes: {
  "accordion-down": {
    from: { height: 0 },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: 0 },
  },
}
```

### Animation Classes
```js
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
}
```

## Usage

### Colors
Access theme colors using the following Tailwind classes:

- Background: `bg-background`
- Text: `text-foreground`
- Primary: `bg-primary text-primary-foreground`
- Secondary: `bg-secondary text-secondary-foreground`
- Muted: `bg-muted text-muted-foreground`
- Accent: `bg-accent text-accent-foreground`
- Destructive: `bg-destructive text-destructive-foreground`

### Border & Ring
- Border: `border-border`
- Ring: `ring-ring`

### Chart Colors
- Chart 1: `text-[hsl(var(--chart-1))]`
- Chart 2: `text-[hsl(var(--chart-2))]`
- Chart 3: `text-[hsl(var(--chart-3))]`
- Chart 4: `text-[hsl(var(--chart-4))]`
- Chart 5: `text-[hsl(var(--chart-5))]`

### Sidebar
- Background: `bg-[hsl(var(--sidebar-background))]`
- Text: `text-[hsl(var(--sidebar-foreground))]`
- Primary: `bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]`
- Accent: `bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]`
- Border: `border-[hsl(var(--sidebar-border))]`
- Ring: `ring-[hsl(var(--sidebar-ring))]`

### Animations
- Accordion Down: `animate-accordion-down`
- Accordion Up: `animate-accordion-up`

## Implementation

1. Copy the color variables to your `globals.css`
2. Update your `tailwind.config.js` with the theme configuration
3. Use the provided Tailwind classes in your components
4. For chart colors and sidebar theme, copy the respective CSS variables

This will ensure consistent styling between your applications while maintaining the modern, clean aesthetic of the design system.