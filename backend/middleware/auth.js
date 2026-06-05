const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação JWT
 * Valida token nos headers da requisição
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(403).json({ error: 'Token inválido' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao validar token' });
  }
}

module.exports = authMiddleware;
