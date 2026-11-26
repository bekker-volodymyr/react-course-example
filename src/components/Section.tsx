import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
