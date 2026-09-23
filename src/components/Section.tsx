import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section style={{ padding: '20px', borderBottom: '2px solid #eee' }}>
      <h2 style={{ color: '#333', marginBottom: '15px' }}>{title}</h2>
      {/* Виводимо вкладений контент */}
      <div>{children}</div>
    </section>
  );
}
