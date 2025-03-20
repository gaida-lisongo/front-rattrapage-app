'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
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
      const response = await request.login(formData);

      if (response.id) {
        const data = await response;
        console.log(data);
        router.push('/game');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Connexion</h1>
        <div className="form-group">
          <label htmlFor="email">Matricule</label>
          <input
            type="text"
            id="email"
            value={formData.matricule}
            onChange={(e) => setFormData({...formData, matricule: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={formData.mdp}
            onChange={(e) => setFormData({...formData, mdp: e.target.value})}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="button">Se connecter</button>
      </form>
    </div>
  );
}
