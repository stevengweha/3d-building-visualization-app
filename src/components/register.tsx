import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      await axios.post('http://localhost:5001/auth/register', { email, password });
      alert('Inscription réussie');
    } catch (err) {
      alert('Erreur : email déjà utilisé');
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Mot de passe" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>S'inscrire</button>
    </div>
  );
}
