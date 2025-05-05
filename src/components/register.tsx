import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css'; // Assurez-vous d'utiliser ce fichier CSS commun pour Login et Register

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      setMessage('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirige après 2 secondes
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Erreur lors de l’inscription');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2 className="title">Inscription</h2>
        <input
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          name="prenom"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="input-field"
          required
          minLength={6}
        />
        <button className="submit-btn" onClick={register}>S'inscrire</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
