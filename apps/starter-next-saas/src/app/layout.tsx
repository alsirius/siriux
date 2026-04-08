import './globals.css';
import type { Metadata } from 'next';
import { appConfig } from '../../config/app-config';
import { SSRErrorBoundary } from '../components/SSRErrorBoundary';
import { NoSSR } from '../components/NoSSR';

export const metadata: Metadata = {
  title: appConfig.app.name,
  description: appConfig.app.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SSRErrorBoundary>
          <NoSSR>
            {children}
          </NoSSR>
        </SSRErrorBoundary>
      </body>
    </html>
  );
}
