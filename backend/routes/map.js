const express = require('express');
const db = require('../config/database').db;

const router = express.Router();

/**
 * GET /api/map/points
 * Obter pontos comerciais em uma região do mapa
 * Query params: x (posição), y (multiplicador), zoom
 */
router.get('/points', (req, res) => {
  try {
    const { x, y, zoom } = req.query;

    // Validações básicas
    if (x === undefined || y === undefined) {
      return res.status(400).json({ error: 'Parâmetros x e y obrigatórios' });
    }

    const database = db();

    // Buscar pontos na região (implementação simplificada)
    const searchPattern = `${String(x).padStart(6, '0')}.${String(y).padStart(6, '0')}%`;

    database.all(
      `SELECT p.id, p.gramap_code, p.name, p.description, 
              (SELECT image_path FROM images WHERE point_id = p.id LIMIT 1) as thumbnail 
       FROM points p 
       WHERE p.gramap_code LIKE ? 
       ORDER BY p.created_at DESC
       LIMIT 100`,
      [searchPattern],
      (err, points) => {
        if (err) {
          console.error('Erro ao buscar pontos:', err);
          return res.status(500).json({ error: 'Erro ao buscar pontos' });
        }

        res.json({
          zoom: zoom || 1,
          x: x,
          y: y,
          points: points || [],
          total: points ? points.length : 0
        });
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /api/map/search
 * Buscar pontos por código GRAMAP
 */
router.get('/search', (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Código GRAMAP obrigatório' });
    }

    const database = db();

    database.get(
      `SELECT p.id, p.gramap_code, p.name, p.description, p.contact, p.created_at,
              u.name as owner_name, u.profile_pic,
              (SELECT COUNT(*) FROM images WHERE point_id = p.id) as image_count
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

        res.json(point);
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
