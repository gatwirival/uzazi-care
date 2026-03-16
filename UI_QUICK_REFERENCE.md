# 🎨 UI Quick Reference Guide

## Color Palette

### Primary Gradients
```css
from-blue-600 to-indigo-600     /* Main brand gradient */
from-purple-600 to-pink-600     /* AI/Intelligence features */
from-green-600 to-teal-600      /* Files/Data features */
from-orange-600 to-red-600      /* Reports/Insights */
from-yellow-600 to-amber-600    /* Speed/Performance */
from-cyan-600 to-blue-600       /* Analytics */
```

### Background Gradients
```css
from-slate-50 via-blue-50 to-indigo-50           /* Light mode */
from-slate-950 via-slate-900 to-indigo-950       /* Dark mode */
```

## Common Components

### Gradient Button
```tsx
<button className="group relative">
  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
  <div className="relative px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-semibold">
    Button Text
  </div>
</button>
```

### Glassmorphic Card
```tsx
<div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
  Card Content
</div>
```

### Gradient Text
```tsx
<h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
  Gradient Text
</h1>
```

### Icon with Gradient Background
```tsx
<div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center">
  <Icon className="h-6 w-6 text-white" />
</div>
```

### Hover Card with Gradient Border
```tsx
<div className="group relative">
  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
  <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all p-6">
    Card Content
  </div>
</div>
```

## Lucide Icons Used

```tsx
import {
  Brain,           // AI/Intelligence
  Users,           // Patients
  FileText,        // Files/Documents
  MessageSquare,   // Chat
  LayoutDashboard, // Dashboard
  Settings,        // Settings
  LogOut,          // Sign Out
  ArrowRight,      // Navigation arrows
  ChevronRight,    // Small arrows
  TrendingUp,      // Metrics going up
  Activity,        // Activity/Stats
  Sparkles,        // AI/Magic
  Shield,          // Security
  Check,           // Checkmarks
  Lock,            // Password/Security
  Mail,            // Email
  User,            // User profile
  Clock,           // Time/Recent
  Zap,             // Speed/Performance
} from "lucide-react";
```

## Layout Structure

### Dashboard with Sidebar
```
┌─────────────────────────────────────┐
│  Sidebar (64 width, fixed left)    │
├─────────────────────────────────────┤
│  ┌─ Top Header (sticky, h-16) ───┐ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│  ┌─ Main Content (p-8) ──────────┐ │
│  │                                 │ │
│  │                                 │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Landing Page Structure
```
┌─ Fixed Nav (backdrop-blur) ──────────┐
├──────────────────────────────────────┤
│  Hero Section (pt-32)                │
│  - Badge                             │
│  - Headline                          │
│  - CTA Buttons                       │
│  - Trust Indicators                  │
│  - Preview Cards                     │
├──────────────────────────────────────┤
│  Features Section (6 cards)          │
├──────────────────────────────────────┤
│  CTA Section (gradient bg)           │
├──────────────────────────────────────┤
│  Footer (4 columns)                  │
└──────────────────────────────────────┘
```

## Responsive Breakpoints

```css
sm:  640px   /* Small devices */
md:  768px   /* Medium devices */
lg:  1024px  /* Large devices */
xl:  1280px  /* Extra large devices */
```

### Common Responsive Patterns
```tsx
/* Grid: 1 col mobile → 3 cols desktop */
className="grid grid-cols-1 md:grid-cols-3 gap-6"

/* Text: Smaller on mobile, larger on desktop */
className="text-4xl md:text-5xl"

/* Hidden on mobile, visible on desktop */
className="hidden lg:flex"

/* Flex column on mobile, row on desktop */
className="flex flex-col sm:flex-row"
```

## Animation Classes

### Hover Effects
```css
group-hover:translate-x-1      /* Arrow shift right */
group-hover:scale-105          /* Card scale up */
group-hover:opacity-100        /* Fade in */
group-hover:text-blue-600      /* Color change */
```

### Transitions
```css
transition-all                 /* All properties */
transition-colors              /* Colors only */
transition-transform           /* Transform only */
transition duration-200        /* Custom duration */
```

## Dark Mode

### Text Colors
```css
text-gray-900 dark:text-white           /* Headings */
text-gray-600 dark:text-gray-300        /* Body text */
text-gray-500 dark:text-gray-400        /* Muted text */
```

### Backgrounds
```css
bg-white dark:bg-slate-800              /* Cards */
bg-gray-50 dark:bg-slate-900            /* Sections */
bg-blue-50 dark:bg-blue-950/50          /* Tinted backgrounds */
```

### Borders
```css
border-gray-200 dark:border-gray-700    /* Default */
border-gray-300 dark:border-gray-600    /* Inputs */
```

## Form Inputs

### Input with Icon
```tsx
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <Mail className="h-5 w-5 text-gray-400" />
  </div>
  <input
    type="email"
    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
    placeholder="email@example.com"
  />
</div>
```

## Spacing System

### Padding
```css
p-2  /* 0.5rem / 8px */
p-4  /* 1rem / 16px */
p-6  /* 1.5rem / 24px */
p-8  /* 2rem / 32px */
p-12 /* 3rem / 48px */
```

### Gaps
```css
gap-2  /* 0.5rem */
gap-4  /* 1rem */
gap-6  /* 1.5rem */
gap-8  /* 2rem */
```

### Rounded Corners
```css
rounded-lg   /* 0.5rem */
rounded-xl   /* 0.75rem */
rounded-2xl  /* 1rem */
rounded-3xl  /* 1.5rem */
rounded-full /* 9999px (circle) */
```

## Shadows

```css
shadow-sm   /* Small shadow */
shadow-lg   /* Large shadow */
shadow-xl   /* Extra large shadow */
shadow-2xl  /* 2XL shadow */
```

## Quick Copy-Paste Components

### Stat Card
```tsx
<div className="group relative">
  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-200"></div>
  <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center">
        <Users className="h-6 w-6 text-white" />
      </div>
      <TrendingUp className="h-4 w-4 text-green-500" />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">2,847</p>
  </div>
</div>
```

### Action Button with Arrow
```tsx
<Link href="/path" className="group relative">
  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
  <div className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold flex items-center">
    <span>Click Me</span>
    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
  </div>
</Link>
```

### Feature Card
```tsx
<div className="group relative">
  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
  <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all">
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
      <Brain className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      AI-Powered
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      Advanced algorithms analyze your data
    </p>
  </div>
</div>
```

## Tips

1. **Always use `group` and `group-hover`** for hover effects on child elements
2. **Blur layers should be absolute** with negative inset for glow effects
3. **Use `backdrop-blur-md`** for glassmorphism
4. **Pair light/dark colors** in every component for theme support
5. **Add transitions** to all interactive elements
6. **Use semantic color names** from the gradient palette
7. **Keep consistent spacing** (multiples of 4: 4, 6, 8, 12)
8. **Round corners generously** (xl, 2xl, 3xl for depth)
9. **Icons should match their container size** (h-6 w-6 for 12-unit container)
10. **Test both themes** (light and dark mode)

## Development Server

```bash
# Start dev server
pnpm dev

# Access at
http://localhost:3001
```

## Pages to Visit

- Landing: `http://localhost:3001/`
- Login: `http://localhost:3001/auth/login`
- Register: `http://localhost:3001/auth/register`
- Dashboard: `http://localhost:3001/dashboard` (requires auth)

---

**Happy Building! 🎨✨**
