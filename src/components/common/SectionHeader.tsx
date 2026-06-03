import type { ReactNode } from 'react';
import { eyebrow, sectionHeading } from '../../styles/classNames';

export interface SectionHeaderProps {
  eyebrowText: string;
  title: ReactNode;
  description?: ReactNode;
  inline?: boolean;
}

export function SectionHeader({ eyebrowText, title, description, inline = false }: SectionHeaderProps) {
  if (inline) {
    return (
      <div className="flex items-baseline gap-4 flex-wrap mb-8">
        <span className={eyebrow}>{eyebrowText}</span>
        <h2 className={sectionHeading}>{title}</h2>
      </div>
    );
  }
  return (
    <>
      <span className={eyebrow}>{eyebrowText}</span>
      <h2 className={`${sectionHeading} mt-3 mb-3`}>{title}</h2>
      {description && <p className="max-w-[64ch] text-[var(--muted2)]">{description}</p>}
    </>
  );
}
