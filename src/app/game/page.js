'use client';
import { useRouter } from 'next/navigation';
import "../globals.css";
import request from '@/api/epreuve';

export default function GamePage() {
  const router = useRouter();

  const startQuiz = async () => {
    console.log('cliaué');
    const epreuve = await request.getEpreuve(10);
    console.log(epreuve);
    
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