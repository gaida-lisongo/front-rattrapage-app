'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import '../../globals.css';

export default function QuestionPage({ params }) {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  useEffect(() => {
    const questionId = parseInt(params.id);
    const question = questions.find(q => q.id === questionId);
    setCurrentQuestion(question);
  }, [params.id]);

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion.id < questions.length) {
      router.push(`/question/${currentQuestion.id + 1}`);
    } else {
      router.push(`/result?score=${score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)}`);
    }
  };

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="question-container">
        <h2 className="title">Question {currentQuestion.id}/{questions.length}</h2>
        <p>{currentQuestion.question}</p>
        <div className="options-list">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}