import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import findRemoveSync from 'find-remove';

// import { RESOLVED_IMG_SIZE } from '../../frontend/src/constants';

const router: Router = Router();
const upload = multer({ dest: 'uploads/', limits: { fieldSize: 1000000 } });
const BUCKET_FILES = './uploads';
/*
	Downloads the image to a temporary folder and also deletes all files from it that are more than 2 hours old.
*/
const uploadTempFile = (file: Express.Multer.File): string => {
    const filePath = file.filename + path.extname(file.originalname).toLowerCase();
    const fullPath = BUCKET_FILES + '/' + file.filename;
    fs.renameSync(`${BUCKET_FILES}/${file.filename}`, `${BUCKET_FILES}/${filePath}`);

    // delete all files that are olders then 2 hours
    findRemoveSync(BUCKET_FILES, { age: { seconds: 100 }, maxLevel: 1, files: '*.*' });
    console.log('PATH: ', filePath);
    return filePath;
};

export const saveFile = (fileName: string, folder: string): string => {
    const fullPath = BUCKET_FILES + '/' + fileName;
    fs.renameSync(fullPath, `${BUCKET_FILES}/${folder}/${fileName}`);
    return fileName;
};

router.post('/file', upload.single('file'), (req: Request, res: Response) =>
    res.json({
        success: true,
        file: req.file ? uploadTempFile(req.file) : null,
        message: 'Image was uploaded successfully!',
    }),
);

export default router;
