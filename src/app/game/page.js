'use client';
import { useRouter } from 'next/navigation';
import "../globals.css";

export default function GamePage() {
  const router = useRouter();

  const startQuiz = () => {
    router.push('/question/1');
  };

  return (
    <div className="container">
      <h1 className="title">Commencer l'examen</h1>
      <button className="button" onClick={startQuiz}>
        Commencer l'examene
      </button>
    </div>
  );
}