const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar diretórios se não existirem
const uploadsDir = process.env.UPLOAD_DIR || './uploads';
const usersDir = path.join(uploadsDir, 'users');
const imagesDir = path.join(uploadsDir, 'images');

[uploadsDir, usersDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = req.path.includes('profile-pic') ? usersDir : imagesDir;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filtro de arquivo
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)'));
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5 MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
