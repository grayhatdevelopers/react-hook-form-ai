import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-foreground">
                React Hook Form AI
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                to="/get-started"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Get Started
              </Link>
              <Link
                to="/examples"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Examples
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <a
                href="https://github.com/grayhatdevelopers/react-hook-form-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.npmjs.com/package/react-hook-form-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
              >
                <img
                  src={`${import.meta.env.BASE_URL}npm.svg`}
                  alt="NPM"
                  className="h-5 w-5 object-contain scale-150"
                />
                <span className="sr-only">NPM Package</span>
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/40 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Built by{' '}
            <a
              href="https://github.com/grayhatdevelopers"
              className="font-medium underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Grayhat Developers
            </a>
            . The source code is available on{' '}
            <a
              href="https://github.com/grayhatdevelopers/react-hook-form-ai"
              className="font-medium underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
