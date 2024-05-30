const multer = require('multer');
const path = require('path');

// Настройка памяти для хранения файлов (будет храниться в оперативной памяти)
const storage = multer.memoryStorage();

// Настройки загрузки видео
const upload = multer({
    storage: storage,
    limits: { fileSize: 80 * 1024 * 1024 }, // Ограничение размера файла до 50MB
    fileFilter: function (req, file, cb) {
        // Разрешенные типы видеофайлов
        const filetypes = /mp4|mov|avi|mkv/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {  
            return cb(null, true);
        } else {
            cb(new Error('Допускаются только видеофайлы форматов .mp4, .mov, .avi, .mkv!'));
        }
    }
});

module.exports = upload;
