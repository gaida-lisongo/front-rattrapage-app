'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import "../globals.css";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = searchParams.get('score');

  return (
    <div className="container">
      <h1 className="title">Quiz Terminé !</h1>
      <p className="score">
        Votre score : {score}/{questions.length}
      </p>
      <button className="button" onClick={() => router.push('/game')}>
        Rejouer
      </button>
    </div>
  );
}