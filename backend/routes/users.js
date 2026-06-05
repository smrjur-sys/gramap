const express = require('express');
const db = require('../config/database').db;
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const Validators = require('../utils/validators');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/**
 * GET /api/users/profile
 * Obter perfil do usuário autenticado
 */
router.get('/profile', authMiddleware, (req, res) => {
  try {
    const database = db();
    database.get(
      'SELECT id, email, name, profile_pic, created_at FROM users WHERE id = ?', 
      [req.user.id], 
      (err, user) => {
        if (err) {
          console.error('Erro ao buscar perfil:', err);
          return res.status(500).json({ error: 'Erro ao buscar perfil' });
        }

        if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * PUT /api/users/profile
 * Atualizar perfil do usuário
 */
router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { name } = req.body;

    if (name && !Validators.isValidName(name)) {
      return res.status(400).json({ error: 'Nome inválido' });
    }

    const database = db();
    database.run(
      'UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name || null, req.user.id],
      function(err) {
        if (err) {
          console.error('Erro ao atualizar perfil:', err);
          return res.status(500).json({ error: 'Erro ao atualizar perfil' });
        }

        res.json({ message: 'Perfil atualizado com sucesso' });
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/users/upload-profile-pic
 * Upload de foto de perfil
 */
router.post('/upload-profile-pic', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const profilePicPath = `/uploads/users/${req.file.filename}`;
    const database = db();

    // Buscar foto anterior para deletar
    database.get(
      'SELECT profile_pic FROM users WHERE id = ?',
      [req.user.id],
      (err, user) => {
        if (user && user.profile_pic) {
          const oldPath = path.join(__dirname, '..', user.profile_pic);
          if (fs.existsSync(oldPath)) {
            fs.unlink(oldPath, (err) => {
              if (err) console.error('Erro ao deletar foto antiga:', err);
            });
          }
        }

        // Atualizar no banco
        database.run(
          'UPDATE users SET profile_pic = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [profilePicPath, req.user.id],
          function(err) {
            if (err) {
              console.error('Erro ao salvar foto:', err);
              return res.status(500).json({ error: 'Erro ao salvar foto' });
            }

            res.json({ 
              message: 'Foto de perfil atualizada',
              profile_pic: profilePicPath
            });
          }
        );
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
