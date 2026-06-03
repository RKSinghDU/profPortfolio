import { NAV } from '../content/nav';
import { useResponsiveSlides } from '../hooks/useResponsiveSlides';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useTheme } from '../hooks/useTheme';
import { Footer } from './layout/Footer';
import { Header } from './layout/Header';
import { ThemeStyles } from './layout/ThemeStyles';
import { About } from './sections/About';
import { Consulting } from './sections/Consulting';
import { Contact } from './sections/Contact';
import { Figures } from './sections/Figures';
import { Hero } from './sections/Hero';
import { Innovations } from './sections/Innovations';
import { LinkedInPosts } from './sections/LinkedInPosts';
import { Research } from './sections/Research';
import { StudentPortal } from './sections/StudentPortal';
import { Teaching } from './sections/Teaching';
import { Videos } from './sections/Videos';

const SECTION_IDS = NAV.map(n => n.id);

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function ProfessorPortfolio() {
  const { isDark, toggle } = useTheme();
  const activeId = useScrollSpy(SECTION_IDS, { initial: 'home' });
  const slidesToShow = useResponsiveSlides();

  return (
    <div
      className={`${isDark ? 'theme-dark' : 'theme-light'} min-h-screen bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--accent)] selection:text-[var(--bg)]`}
      style={{ fontFamily: '"Mukta", system-ui, sans-serif' }}
    >
      <Header activeId={activeId} isDark={isDark} onToggleTheme={toggle} onNavigate={scrollToSection} />

      <main>
        <Hero onNavigate={scrollToSection} />
        <Figures />
        <About />
        <Research />
        <Innovations />
        <Consulting onNavigate={scrollToSection} />
        <Teaching />
        <StudentPortal />
        <Videos slidesToShow={slidesToShow} />
        <LinkedInPosts slidesToShow={slidesToShow} />
        <Contact />
      </main>

      <Footer />
      <ThemeStyles />
    </div>
  );
}
