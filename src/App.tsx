import { Analytics } from '@vercel/analytics/react';
import ProfessorPortfolio from './components/ProfessorPortfolio';

export default function App() {
  return (
    <>
      <ProfessorPortfolio />
      <Analytics />
    </>
  );
}
