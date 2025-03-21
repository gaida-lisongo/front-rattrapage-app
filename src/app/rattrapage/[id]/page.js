'use client';
import { useState, useEffect, use } from 'react';
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

  // Call useAuth after initialization
  useAuth();

  // Get epreuveId from params
  const epreuveId = use(params).id;

  // Check if user has already attempted this exam
  useEffect(() => {
    const checkExamAttempt = async () => {
      if (typeof window === 'undefined') return;

      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !epreuveId) {
          setShowModal(true);
          return;
        }

        const response = await request.getResults(userData.id);
        const lastResults = response.data;

        if (lastResults?.length > 0) {
          const hasAttempted = lastResults.some(
            result => result.id_rattrapage === parseInt(epreuveId)
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
    };

    checkExamAttempt();
  }, [epreuveId]);

  // Fetch exam data
  useEffect(() => {
    const fetchEpreuve = async () => {
      if (!epreuveId) return;

      try {
        const response = await request.getEpreuve(parseInt(epreuveId));
        setEpreuve(response);
      } catch (error) {
        console.error("Erreur lors du chargement de l'épreuve:", error);
      }
    };

    fetchEpreuve();
  }, [epreuveId]);

  const handleStartExam = () => {
    if (!epreuve) return;

    try {
      // Store exam data with all necessary properties
      const examData = {
        ...epreuve,
        examId: epreuve.id,
        startTime: new Date().getTime(),
        duree: epreuve.duree,
        questions: epreuve.questions.map((q, index) => ({
          ...q,
          order: index + 1
        }))
      };

      // Store in localStorage
      localStorage.setItem('currentExam', JSON.stringify(examData));
      localStorage.setItem('currentScore', '0');
      localStorage.setItem('epreuveId', epreuveId);

      router.push('/question/1');
    } catch (error) {
      console.error('Error storing exam data:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.replace('/');
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
            <p className="exam-subtitle">Résumé de l&apos;épreuve</p>
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
              <li>Assurez-vous d&apos;avoir une connexion internet stable</li>
              <li>Ne quittez pas la fenêtre pendant l&apos;examen</li>
              <li>Le temps commence dès que vous cliquez sur &quot;Commencer&quot;</li>
              <li>Répondez à toutes les questions dans le temps imparti</li>
            </ul>
          </div>

          <button className="start-button" onClick={handleStartExam}>
            <FaPlay className="button-icon" />
            Commencer l&apos;examen
          </button>
        </div>
      )}
    </div>
  );
}