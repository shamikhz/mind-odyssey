import PlayClient from './PlayClient';
import { levels } from '@/data/levels';

export const runtime = 'edge';

export function generateStaticParams() {
  return levels.map((level) => ({
    id: level.id.toString(),
  }));
}

export default function Page() {
  return <PlayClient />;
}
