# FPHaikal Portfolio

![Portfolio Banner](public/og.png)

A modern, immersive personal portfolio website built with Next.js 14 and HeroUI. This project showcases my skills, experience, and projects through a sleek glassmorphism aesthetic and dynamic interactive elements.

## ✨ Key Features

- **🌐 Modern Tech Stack**: Built with Next.js 14 (App Router), React 19, and TypeScript.
- **🎨 Glassmorphism Design**: Premium UI with translucent cards, real-time background blurring, and subtle gradients using `HeroUI` and `Tailwind CSS`.
- **🎵 Live Spotify Integration**: Real-time "Now Playing" widget displaying current track, progress, and synced lyrics.
- **🌊 Fluid Background**: Dynamic, animated gradient background that shifts and flows.
- **📱 Fully Responsive**: Optimized for all devices, from mobile phones to large desktop screens.
- **⚡ High Performance**: optimized assets, lazy loading, and effective caching strategies.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [HeroUI (NextUI v2)](https://heroui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: React Hooks & Context
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/fphaikal/fph-portfolio.git
    cd fph-portfolio
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    # API Configuration
    NEXT_PUBLIC_API_URL=your-api-domain.com
    FPH_API_URL=https://your-backend-api.com
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
.
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components
│   ├── home/             # Components specific to the homepage
│   ├── spotify/          # Spotify integration components
│   └── ui/               # Generic UI components (GlassCard, etc.)
├── config/               # Application configuration
├── context/              # React Context providers
├── public/               # Static assets
└── styles/               # Global styles and Tailwind config
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [FPHaikal](https://github.com/fphaikal)
