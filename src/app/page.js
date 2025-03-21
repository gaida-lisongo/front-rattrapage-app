'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaUser, FaLock } from 'react-icons/fa';
import styles from "./page.module.css";
import request from '@/api/user';

export default function Home() {
  const [formData, setFormData] = useState({
    matricule: '',
    mdp: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await request.login(formData);
      if (result.success) {
        router.replace('/rattrapage');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-container">
          <Image
            src="https://he.inbtp.net/public/Views/template/img/product/profile-bg.jpeg"
            alt="HE Logo"
            width={250}
            height={250}
            priority
          />
        </div>
        
        <h1 className="auth-title">Section HE</h1>
        <p className="auth-subtitle">Plateforme d&apos;examens en ligne</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="matricule">
              <FaUser className="input-icon" />
              Matricule
            </label>
            <input
              type="text"
              id="matricule"
              placeholder="Entrez votre matricule"
              value={formData.matricule}
              onChange={(e) => setFormData({...formData, matricule: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              placeholder="Entrez votre mot de passe"
              value={formData.mdp}
              onChange={(e) => setFormData({...formData, mdp: e.target.value})}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
