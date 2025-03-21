'use client';
import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import request from '@/api/epreuve';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';

export default function RattrapagePage({ params }) {
  const router = useRouter();
  const [epreuve, setEpreuve] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Get ID from params immediately
  const idParam = use(params).id;
  
  // Store exam ID in localStorage before any other operations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('epreuveId', idParam);
    }
  }, [idParam]);

  // Now call useAuth after ID is stored
  useAuth();

  // Use the stored ID directly from localStorage in your logic
  const checkExamAttempt = useMemo(async () => {
    const storedId = localStorage.getItem('epreuveId');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData || !storedId) {
      setShowModal(true);
      return;
    }

    try {
      const response = await request.getResults(userData.id);
      const lastResults = response.data;

      if (lastResults?.length > 0) {
        const hasAttempted = lastResults.some(
          result => result.id_rattrapage === parseInt(storedId)
        );

        if (hasAttempted) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch exam data using the stored ID
  useEffect(() => {
    const storedId = localStorage.getItem('epreuveId');
    if (!storedId) return;

    const fetchEpreuve = async () => {
      try {
        const response = await request.getEpreuve(parseInt(storedId));
        setEpreuve(response);
      } catch (error) {
        console.error("Erreur lors du chargement de l'épreuve:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpreuve();
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    router.replace('/');
  };

  const handleStartExam = () => {
    if (epreuve) {
      // Mélanger les questions
      const shuffledQuestions = [...epreuve.questions]
        .sort(() => Math.random() - 0.5)
        .map((q, index) => ({ ...q, order: index + 1 }));
      
      // Stocker les informations nécessaires dans localStorage
      localStorage.setItem('currentExam', JSON.stringify({
        examId: epreuve.examenId,
        questions: shuffledQuestions,
        totalTime: epreuve.duree * 60, // Conversion en secondes
        startTime: new Date().getTime(),
        cours: epreuve.cours,
        annee: epreuve.annee
      }));

      // Rediriger vers la première question
      router.push('/question/1');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="exam-page">
      <Modal
        isOpen={showModal}
        message="Désolé, vous avez déjà passé cet examen de rattrapage. Vous ne pouvez pas le repasser."
        onClose={handleModalClose}
      />
      
      {!showModal && epreuve && (
        <div className="exam-card">
          <div className="logo-container">
            <Image
              src="https://he.inbtp.net/public/Views/template/img/product/profile-bg.jpeg"
              alt="HE Logo"
              width={80}
              height={80}
              priority
            />
          </div>

          <div className="exam-header">
            <h1 className="exam-title">{epreuve.cours}</h1>
            <p className="exam-subtitle">Résumé de l'épreuve</p>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Année académique</span>
              <span className="info-value">{epreuve.annee}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{epreuve.date}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Durée</span>
              <span className="info-value">{epreuve.duree} minutes</span>
            </div>
            <div className="info-item">
              <span className="info-label">Questions</span>
              <span className="info-value">{epreuve.questions.length}</span>
            </div>
          </div>

          <div className="exam-instructions">
            <h2 className="instructions-title">Instructions</h2>
            <ul className="instructions-list">
              <li>Assurez-vous d'avoir une connexion internet stable</li>
              <li>Ne quittez pas la fenêtre pendant l'examen</li>
              <li>Le temps commence dès que vous cliquez sur "Commencer"</li>
              <li>Répondez à toutes les questions dans le temps imparti</li>
            </ul>
          </div>

          <button className="start-button" onClick={handleStartExam}>
            <FaPlay className="button-icon" />
            Commencer l'examen
          </button>
        </div>
      )}
    </div>
  );
}