# Talky - AI-Powered Video Messaging App

Talky is an AI-powered video messaging application that breaks down language barriers through real-time translation technology. Built with Next.js, TypeScript, and modern UI libraries.

## 🚀 Features

- **Real-time Chat Translation**: Instant message translation between different languages
- **Video Calls with Live Subtitles**: Video calls with real-time translation overlays
- **OCR Scanner**: Translate text from images using camera or uploaded photos
- **AI Phone Caller**: AI makes calls in different languages on your behalf
- **Multi-language Support**: Support for major world languages
- **Responsive Design**: Optimized for both desktop and mobile devices

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Package Manager**: pnpm
- **Authentication**: Clerk
- **UI Libraries**:
  - ShadCN UI (primary components)
  - HeroUI (additional components)
  - Tailwind CSS (styling)
  - Framer Motion (animations)
- **Icons**: Lucide React
- **Fonts**: Inter (primary), JetBrains Mono (monospace)

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (#0066FF)
- **Secondary**: White (#FFFFFF)
- **Text**: Dark Forest Green (#0D2818)
- **Background**: White with subtle gradients
- **Accent**: Electric Blue for interactive elements

### Typography
- **Primary Font**: Inter
- **Monospace Font**: JetBrains Mono

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DilSidequest/Talky.git
cd Talky
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Clerk authentication keys to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── (auth)/         # Authentication pages
│   ├── (dashboard)/    # Protected dashboard routes
│   ├── globals.css     # Global styles and design tokens
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
│   └── ui/            # ShadCN UI components
├── lib/               # Utilities and configurations
└── middleware.ts      # Clerk authentication middleware
```

## 🔐 Authentication

The app uses Clerk for authentication with the following routes:
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/chat` - Protected chat dashboard (redirects here after auth)

## 📱 Routes

### Public Routes
- `/` - Landing page
- `/sign-in` - Authentication sign-in
- `/sign-up` - Authentication sign-up

### Protected Routes (Require Authentication)
- `/chat` - Chat dashboard/list
- `/call` - Video call interface
- `/ocr` - OCR camera scanner
- `/ai-caller` - AI phone caller dashboard
- `/settings` - User settings

## 🎯 Development Status

### ✅ Phase 1: Project Foundation & Setup (COMPLETED)
- [x] Next.js project initialization with TypeScript
- [x] pnpm configuration
- [x] ESLint and Prettier setup
- [x] Tailwind CSS with custom color palette
- [x] Project folder structure
- [x] ShadCN UI integration
- [x] HeroUI integration
- [x] Framer Motion setup
- [x] Clerk authentication setup
- [x] Authentication middleware
- [x] Protected routes configuration
- [x] Design system foundation
- [x] Responsive breakpoints
- [x] Base layout components
- [x] Landing page with hero section
- [x] Authentication pages
- [x] Dashboard layout with navigation
- [x] Basic pages for all main features

### 🚧 Next Steps (Phase 2)
- [ ] Enhanced landing page with animations
- [ ] Improved navigation system
- [ ] Chat interface development
- [ ] Video call interface
- [ ] OCR camera functionality
- [ ] AI caller interface

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Clerk](https://clerk.com/) for authentication
- [ShadCN UI](https://ui.shadcn.com/) for beautiful components
- [HeroUI](https://heroui.com/) for additional UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
