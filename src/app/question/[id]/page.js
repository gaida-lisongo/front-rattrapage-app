'use client';
import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import request from '@/api/epreuve';
import Loader from '@/components/Loader';
import { FaClock } from 'react-icons/fa';
import Image from 'next/image';

export default function QuestionPage({ params }) {
  useAuth();
  const router = useRouter();
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [score, setScore] = useState(0); // Initialize with 0
  const [loading, setLoading] = useState(false);
  const scoreRef = useRef(0); // Pour tracker le score actuel de manière fiable

  const questionNumber = parseInt(use(params).id);

  // Move localStorage operations into useEffect
  useEffect(() => {
    // Safe localStorage access after component mount
    const savedScore = localStorage.getItem('currentScore');
    if (savedScore) {
      setScore(parseFloat(savedScore));
    }
  }, []);
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('currentExam'));
    if (!data) {
      router.replace('/');
      return;
    }
    setExamData(data);
    
    const question = data.questions.find(q => q.order === questionNumber);
    setCurrentQuestion(question);

    // Gestion du temps
    const elapsed = Math.floor((new Date().getTime() - data.startTime) / 1000);
    const remaining = data.totalTime - elapsed;
    setTimeLeft(remaining);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questionNumber]);

  // Ajouter un gestionnaire de visibilité
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentQuestion) {
        // L'utilisateur a quitté la page
        handlePenalty();
      }
    };

    const handleWindowBlur = () => {
      if (currentQuestion) {
        // L'utilisateur a changé de fenêtre
        handlePenalty();
      }
    };

    // Ajouter les écouteurs d'événements
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      // Nettoyer les écouteurs
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [currentQuestion]);

  const handlePenalty = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Mettre à jour le score (0 points pour la question actuelle)
      const newScore = score;
      setScore(newScore);
      localStorage.setItem('currentScore', newScore.toString());

      // Passer à la question suivante si ce n'est pas la dernière
      if (currentQuestion.order < examData.questions.length) {
        router.push(`/question/${currentQuestion.order + 1}`);
      } else {
        saveAndRedirect();
      }
    } catch (error) {
      console.error('Erreur lors de la pénalité:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un message d'avertissement
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Attention : Quitter cette page vous fera perdre des points !";
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleTimeUp = () => {
    if (typeof window !== 'undefined') {
      saveAndRedirect(true);
    }
  };

  const handleAnswer = async (choix, index) => {
    if (loading || !currentQuestion) return;
    setLoading(true);

    try {
      const response = await request.getCheckAnswer(currentQuestion.id, index);
      const result = response;

      if (result.status) {
        // Si la réponse est correcte, mettre à jour le score
        if (result.data.correct) {
          const newScore = scoreRef.current + parseFloat(currentQuestion.pts);
          scoreRef.current = newScore; // Mettre à jour la référence
          setScore(newScore);
          localStorage.setItem('currentScore', newScore.toString());
        }

        // Pour la dernière question, attendre que le score soit mis à jour
        if (currentQuestion.order >= examData.questions.length) {
          await saveAndRedirect();
        } else {
          router.replace(`/question/${currentQuestion.order + 1}`);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la réponse:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveAndRedirect = async (timeUp = false) => {
    if (typeof window === 'undefined') return;

    try {
      // Utiliser scoreRef pour avoir la valeur la plus à jour
      const finalScore = scoreRef.current;
      
      await localStorage.setItem('examResults', JSON.stringify({
        examId: examData?.examId,
        cours: examData?.cours,
        annee: examData?.annee,
        score: finalScore,
        totalQuestions: examData?.questions.length,
        timeUp
      }));

      const userData = JSON.parse(localStorage.getItem('user'));
      // Nettoyer le score en cours
      localStorage.removeItem('currentScore');
      const payload = {
        studentId: userData.id, 
        examId: examData.examId, 
        score: finalScore, 
        url: ''
      };

      request.setResult(payload)
        .then(async (resp) => {
          console.log('Résultat sauvegardé:', resp)
          await router.replace('/result');
        })
        .catch(err => console.error('Erreur lors de la sauvegarde du résultat:', err));
      // Attendre que tout soit sauvegardé avant la redirection
    } catch (error) {
      console.error('Error saving results:', error);
      router.replace('/result');
    }
  };

  // Initialiser scoreRef avec le score sauvegardé
  useEffect(() => {
    const savedScore = localStorage.getItem('currentScore');
    if (savedScore) {
      const parsedScore = parseFloat(savedScore);
      scoreRef.current = parsedScore;
      setScore(parsedScore);
    }
  }, []);

  if (!currentQuestion || loading) return <Loader />;

  return (
    <div className="question-page">
      <div className="timer">
        <FaClock className="timer-icon" />
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      
      <div className="question-card">
        <div className="logo-container">
          <Image
            src="https://he.inbtp.net/public/Views/template/img/product/profile-bg.jpeg"
            alt="HE Logo"
            width={60}
            height={60}
            priority
          />
        </div>

        <div className="progress-header">
          <div className="progress-text">
            Question {currentQuestion?.order}/{examData?.questions.length}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(currentQuestion?.order / examData?.questions.length) * 100}%` 
              }}
            />
          </div>
        </div>
        
        {currentQuestion?.image && (
          <div className="question-image">
            <img src={currentQuestion.image} alt="Question" />
          </div>
        )}
        
        <div className="question-content">
          <p className="question-text">{currentQuestion?.enonce}</p>
          
          <div className="choices-grid">
            {Array.from({ length: 7 }, (_, i) => i + 1).map(num => {
              const choix = currentQuestion?.[`choix_${num}`];
              if (!choix) return null;
              
              return (
                <button
                  key={num}
                  className="choice-button"
                  onClick={() => handleAnswer(choix, num)}
                  disabled={loading}
                >
                  <span className="choice-number">{num}</span>
                  <span className="choice-text">{choix}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}