# Next.js 14 App Router Project

A modern Next.js 14 project with App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, ESLint, and Prettier.

## Features

- ⚡ **Next.js 14** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** components
- ✨ **Framer Motion** for animations
- 📝 **ESLint** for code quality
- 💅 **Prettier** for code formatting

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nextjs-app-router
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── app/                 # App Router pages and layouts
├── components/          # Reusable components
│   └── ui/            # shadcn/ui components
├── lib/                # Utility functions
└── styles/             # Global styles
```

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

## Technologies Used

- [Next.js 14](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## License

MIT
