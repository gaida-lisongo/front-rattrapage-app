'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  FaUser, 
  FaIdCard, 
  FaEnvelope, 
  FaBirthdayCake, 
  FaVenusMars,
  FaPrint,
  FaArrowLeft,
  FaGraduationCap,
  FaCalendarAlt,
  FaTrophy
} from 'react-icons/fa';
import Image from 'next/image';
import request from '@/api/epreuve';

export default function ResultPage() {
  useAuth();
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const resultsData = JSON.parse(localStorage.getItem('examResults'));
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!resultsData || !userData) {
      router.replace('/');
      return;
    }
    console.log('Results :', resultsData);
    console.log('User :', userData);
    setResults(resultsData);
    setUser(userData);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {

    const payload = {
      studentId: user.id, 
      examId: results.examId, 
      score: results.score, 
      url: ''
    };
    request.setResult(payload)
      .then(resp => console.log('Result saved:', resp))
      .catch(err => console.error('Error saving result:', err));

    router.replace('/rattrapage');

  };
  if (!results || !user) return <div>Chargement...</div>;

  const noteFinale = (results.score * 20) / results.totalPossiblePoints;
  const dateNaissance = new Date(user.date_naiss).toLocaleDateString();

  return (
    <div className="result-container">
      <div className="invoice-container">
        <div className="invoice-header">
          <div className="student-avatar">
            <img
              src={user.avatar}
              alt={user.nom}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="student-details">
            <div className="detail-item">
              <div className="detail-label">
                <FaIdCard className="icon" /> Matricule
              </div>
              <div className="detail-value">{user.matricule}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <FaUser className="icon" /> Nom complet
              </div>
              <div className="detail-value">{`${user.nom} ${user.post_nom} ${user.prenom}`}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <FaBirthdayCake className="icon" /> Date de naissance
              </div>
              <div className="detail-value">{dateNaissance}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <FaEnvelope className="icon" /> Email
              </div>
              <div className="detail-value">{user.e_mail}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <FaVenusMars className="icon" /> Sexe
              </div>
              <div className="detail-value">{user.sexe}</div>
            </div>
          </div>
        </div>

        <div className="exam-header">
          <div className="exam-title">
            <FaGraduationCap className="icon" /> Relevé de Notes - {results.cours}
          </div>
          <div className="exam-date">
            <FaCalendarAlt className="icon" /> Session de rattrapage - Année académique {results.annee}
          </div>
        </div>

        <div className="score-section">
          <div className="score-circle">
            <FaTrophy className="trophy-icon" />
            <div className="score-number">
              {results.score}/20
            </div>
          </div>
          <div className="score-details">
            <div className=''>
              <span>Points obtenus : </span>
              <strong>{results.score}</strong>
            </div>
            <div className="">
              <span>Maximum : </span>
              <strong>{20}</strong>
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="button print-button" onClick={handlePrint}>
            <FaPrint className="icon" /> Imprimer le relevé
          </button>
          <button className="button" onClick={() => handleBack()}>
            <FaArrowLeft className="icon" /> Retour
          </button>
        </div>
      </div>
    </div>
  );
}