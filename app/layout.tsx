import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Divo', description: 'Messages and video calls' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
