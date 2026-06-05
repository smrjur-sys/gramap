const express = require('express');
const db = require('../config/database').db;
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const GramapGenerator = require('../utils/gramapGenerator');
const Validators = require('../utils/validators');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/**
 * GET /api/points/:code
 * Obter ponto comercial pelo código GRAMAP
 */
router.get('/:code', (req, res) => {
  try {
    const { code } = req.params;

    if (!GramapGenerator.isValidCode(code)) {
      return res.status(400).json({ error: 'Código GRAMAP inválido' });
    }

    const database = db();
    database.get(
      `SELECT p.*, u.name as owner_name, u.profile_pic 
       FROM points p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.gramap_code = ?`,
      [code],
      (err, point) => {
        if (err) {
          console.error('Erro ao buscar ponto:', err);
          return res.status(500).json({ error: 'Erro ao buscar ponto' });
        }

        if (!point) {
          return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        // Buscar imagens
        database.all(
          'SELECT image_path FROM images WHERE point_id = ? ORDER BY order_num',
          [point.id],
          (err, images) => {
            if (err) {
              console.error('Erro ao buscar imagens:', err);
              return res.status(500).json({ error: 'Erro ao buscar imagens' });
            }

            point.images = images || [];
            res.json(point);
          }
        );
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/points
 * Criar novo ponto comercial (requer autenticação)
 */
router.post('/', authMiddleware, (req, res) => {
  try {
    const { gramap_code, name, description, contact } = req.body;

    // Validações
    if (!gramap_code || !GramapGenerator.isValidCode(gramap_code)) {
      return res.status(400).json({ error: 'Código GRAMAP inválido' });
    }

    if (!Validators.isValidName(name)) {
      return res.status(400).json({ error: 'Nome inválido' });
    }

    if (!Validators.isValidDescription(description)) {
      return res.status(400).json({ error: 'Descrição inválida' });
    }

    if (!Validators.isValidContact(contact)) {
      return res.status(400).json({ error: 'Contato inválido' });
    }

    const database = db();

    // Verificar se célula já tem ponto
    database.get(
      'SELECT id FROM points WHERE gramap_code = ?',
      [gramap_code],
      (err, existing) => {
        if (err) {
          console.error('Erro ao verificar célula:', err);
          return res.status(500).json({ error: 'Erro ao verificar célula' });
        }

        if (existing) {
          return res.status(409).json({ error: 'Esta célula já possui um ponto registrado' });
        }

        // Inserir novo ponto
        database.run(
          `INSERT INTO points (user_id, gramap_code, name, description, contact) 
           VALUES (?, ?, ?, ?, ?)`,
          [req.user.id, gramap_code, name, description || null, contact || null],
          function(err) {
            if (err) {
              console.error('Erro ao criar ponto:', err);
              return res.status(500).json({ error: 'Erro ao criar ponto' });
            }

            res.status(201).json({
              message: 'Ponto comercial criado com sucesso',
              point_id: this.lastID,
              gramap_code: gramap_code
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

/**
 * PUT /api/points/:id
 * Atualizar ponto comercial (apenas do proprietário)
 */
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, contact } = req.body;

    const database = db();

    // Verificar propriedade
    database.get(
      'SELECT user_id FROM points WHERE id = ?',
      [id],
      (err, point) => {
        if (err) {
          console.error('Erro ao buscar ponto:', err);
          return res.status(500).json({ error: 'Erro ao buscar ponto' });
        }

        if (!point) {
          return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        if (point.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Você não tem permissão para editar este ponto' });
        }

        // Atualizar
        database.run(
          `UPDATE points SET name = ?, description = ?, contact = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [name || null, description || null, contact || null, id],
          function(err) {
            if (err) {
              console.error('Erro ao atualizar ponto:', err);
              return res.status(500).json({ error: 'Erro ao atualizar ponto' });
            }

            res.json({ message: 'Ponto atualizado com sucesso' });
          }
        );
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * DELETE /api/points/:id
 * Deletar ponto comercial (apenas do proprietário)
 */
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const database = db();

    database.get(
      'SELECT user_id FROM points WHERE id = ?',
      [id],
      (err, point) => {
        if (err) {
          console.error('Erro ao buscar ponto:', err);
          return res.status(500).json({ error: 'Erro ao buscar ponto' });
        }

        if (!point) {
          return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        if (point.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Você não tem permissão para deletar este ponto' });
        }

        // Deletar (CASCADE vai deletar imagens)
        database.run(
          'DELETE FROM points WHERE id = ?',
          [id],
          function(err) {
            if (err) {
              console.error('Erro ao deletar ponto:', err);
              return res.status(500).json({ error: 'Erro ao deletar ponto' });
            }

            res.json({ message: 'Ponto deletado com sucesso' });
          }
        );
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/points/:id/upload-image
 * Upload de imagem para ponto (máximo 5)
 */
router.post('/:id/upload-image', authMiddleware, upload.single('file'), (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const database = db();

    // Verificar propriedade do ponto
    database.get(
      'SELECT user_id FROM points WHERE id = ?',
      [id],
      (err, point) => {
        if (err) {
          console.error('Erro ao buscar ponto:', err);
          return res.status(500).json({ error: 'Erro ao buscar ponto' });
        }

        if (!point) {
          return res.status(404).json({ error: 'Ponto não encontrado' });
        }

        if (point.user_id !== req.user.id) {
          return res.status(403).json({ error: 'Você não tem permissão' });
        }

        // Verificar limite de imagens
        database.get(
          'SELECT COUNT(*) as count FROM images WHERE point_id = ?',
          [id],
          (err, result) => {
            if (err) {
              console.error('Erro ao verificar imagens:', err);
              return res.status(500).json({ error: 'Erro ao verificar imagens' });
            }

            if (result.count >= 5) {
              return res.status(400).json({ error: 'Limite de 5 imagens atingido' });
            }

            // Inserir imagem
            const imagePath = `/uploads/images/${req.file.filename}`;
            database.run(
              'INSERT INTO images (point_id, image_path, order_num) VALUES (?, ?, ?)',
              [id, imagePath, result.count + 1],
              function(err) {
                if (err) {
                  console.error('Erro ao salvar imagem:', err);
                  return res.status(500).json({ error: 'Erro ao salvar imagem' });
                }

                res.status(201).json({
                  message: 'Imagem enviada com sucesso',
                  image: {
                    id: this.lastID,
                    path: imagePath
                  }
                });
              }
            );
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
