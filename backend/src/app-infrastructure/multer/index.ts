import multer from 'multer';

export const MULTER_REQUEST_KEY = 'image' as const;
const FILE_SIZE_LIMIT_TO_MEMORY = 30 * 1024;

export const storageToMemory = multer.memoryStorage();

export const uploadSingleToMemory = multer({
  storage: storageToMemory,
  limits: { fileSize: FILE_SIZE_LIMIT_TO_MEMORY },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpg|jpeg|png|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
}).single(MULTER_REQUEST_KEY);
