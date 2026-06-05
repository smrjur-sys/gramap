const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database').db;
const Validators = require('../utils/validators');

const router = express.Router();

/**
 * POST /api/auth/register
 * Registrar novo usuário
 */
router.post('/register', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!Validators.isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!Validators.isValidPassword(password)) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Hash da senha
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao processar senha' });
      }

      // Inserir usuário no banco
      const database = db();
      database.run(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [email, hash],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(409).json({ error: 'Este email já está registrado' });
            }
            console.error('Erro ao registrar:', err);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
          }

          res.status(201).json({ 
            message: 'Usuário registrado com sucesso',
            user_id: this.lastID
          });
        }
      );
    });
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/auth/login
 * Fazer login
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const database = db();

    // Buscar usuário
    database.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Comparar senha
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) {
          console.error('Erro ao verificar senha:', err);
          return res.status(500).json({ error: 'Erro ao verificar senha' });
        }

        if (!isMatch) {
          return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        // Gerar token JWT
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || 'sua_chave_secreta',
          { expiresIn: process.env.JWT_EXPIRY || '7d' }
        );

        res.json({ 
          message: 'Login bem-sucedido',
          token: token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profile_pic: user.profile_pic
          }
        });
      });
    });
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
