'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { FaPlay, FaGraduationCap } from 'react-icons/fa';
import Modal from '@/components/Modal';
import { useState } from 'react';

export default function GamePage() {
  useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const startQuiz = async () => {
    const epreuveId = localStorage.getItem('epreuveId');
    const parsedId = parseInt(epreuveId);
    
    if (!epreuveId || isNaN(parsedId)) {
      setShowModal(true);
      return;
    }
    
    router.push(`/rattrapage/${parsedId}`);
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push('/');
  };

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="logo-container">
          <Image
            src="https://he.inbtp.net/public/Views/template/img/product/profile-bg.jpeg"
            alt="HE Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        <div className="welcome-content">
          <FaGraduationCap className="welcome-icon" />
          <h1 className="welcome-title">Bienvenue sur la plateforme de la section HE</h1>
          <p className="welcome-text">
            Vous êtes sur le point de commencer votre examen de rattrapage.
            Assurez-vous d&apos;être dans un environnement calme et approprié.
          </p>
        </div>

        <button className="start-button" onClick={startQuiz}>
          <FaPlay className="button-icon" />
          Commencer l&apos;examen
        </button>
      </div>

      <Modal
        isOpen={showModal}
        message="Nous n'avons pas pu trouver votre examen. Veuillez contacter l'administration ou scannez le QR Code."
        onClose={handleModalClose}
      />
    </div>
  );
}