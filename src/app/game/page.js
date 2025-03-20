'use client';
import { useRouter } from 'next/navigation';
import '../../app/global.css';

export default function GamePage() {
  const router = useRouter();

  const startQuiz = () => {
    router.push('/question/1');
  };

  return (
    <div className="container">
      <h1 className="title">Quiz App</h1>
      <button className="button" onClick={startQuiz}>
        Commencer le Quiz
      </button>
    </div>
  );
}