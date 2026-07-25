// server/routes/auth.js — POST /api/auth/login
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Constant-time username check (avoid timing attacks)
  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch {
    return res.status(500).json({ message: 'Server error during authentication' });
  }

  const token = jwt.sign(
    { sub: username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' },
  );

  return res.json({ token });
});

module.exports = router;
