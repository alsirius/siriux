'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function TestSimplePage() {
  return (
    <div>
      <h1>Simple Test Page</h1>
      <p>No context, no imports, just basic HTML</p>
    </div>
  );
}
