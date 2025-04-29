import express from 'express';
import bcrypt from 'bcrypt';
import { createPool } from 'mysql2/promise';

const router = express.Router();
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dpe_france'
});

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const [rows] = await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Email déjà utilisé' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

  if (rows.length === 0) return res.status(401).json({ error: 'Identifiants invalides' });

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  res.json({ success: true, userId: rows[0].id });
});

export default router;
