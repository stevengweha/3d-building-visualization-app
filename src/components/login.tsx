import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css'; // Assurez-vous d'utiliser ce fichier CSS commun pour Login et Register

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setMessage('✅ Connexion réussie !');
      
      navigate('/Home');
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Identifiants incorrects');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2 className="title">Connexion</h2>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button className="submit-btn" onClick={login}>Se connecter</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
