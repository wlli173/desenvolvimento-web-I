// src/config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Verifica e cria a pasta se não existir
if (!fs.existsSync(UPLOAD_DIR)) {
  console.log(`Criando diretório de upload: ${UPLOAD_DIR}`);
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} else {
  console.log(`Diretório de upload já existe: ${UPLOAD_DIR}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(`Multer: Salvando arquivo no diretório: ${UPLOAD_DIR}`);
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    console.log(`Multer: Nome original: ${file.originalname}, Novo nome: ${filename}`);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log(`Multer: Verificando arquivo: ${file.originalname}, Tipo: ${file.mimetype}`);

  // aceita apenas imagens
  if (!file.mimetype.startsWith('image/')) {
    console.log(`Multer: REJEITADO - Não é imagem: ${file.mimetype}`);
    return cb(new Error('Somente arquivos de imagem são permitidos'), false);
  }

  console.log(`Multer: ACEITO - ${file.originalname}`);
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});

// Middleware de debug para multer
const uploadWithDebug = (req, res, next) => {
  console.log('=== MULTER DEBUG MIDDLEWARE ===');
  console.log('Content-Type header:', req.headers['content-type']);
  console.log('Tem body?', req.body ? 'Sim' : 'Não');
  console.log('Tem files?', req.files ? 'Sim' : 'Não');

  upload.single('cover')(req, res, (err) => {
    if (err) {
      console.error('Erro no multer:', err.message);
      console.error('Erro stack:', err.stack);
      return res.status(400).json({ erro: err.message });
    }
    next();
  });
};

module.exports = { upload, uploadWithDebug, UPLOAD_DIR };