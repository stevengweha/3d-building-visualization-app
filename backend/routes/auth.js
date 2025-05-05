const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const router = express.Router();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 🔐 Route d'inscription
router.post('/register', async (req, res) => {
  const { email, password, nom, prenom, role = 'user' } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Champs manquants' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (email, password, nom, prenom, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, nom || '', prenom || '', role]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Email déjà utilisé ou erreur serveur' });
  }
});

// 🔐 Route de connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) return res.status(401).json({ error: 'Email introuvable' });

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role } });
});

module.exports = router;
