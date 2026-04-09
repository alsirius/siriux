import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { appConfig } from '../../config/app-config';

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
        {children}
      </body>
    </html>
  );
}
