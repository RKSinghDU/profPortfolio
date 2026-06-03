import { SITE } from '../../content/siteConfig';
import { serif } from '../../styles/classNames';

export function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-wrap gap-3 justify-between items-center text-[0.82rem]">
        <span>
          <span className={`${serif} text-[var(--footer-name)]`}>{SITE.name}</span> &middot; Department of Commerce,{' '}
          {SITE.affiliation}
        </span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
