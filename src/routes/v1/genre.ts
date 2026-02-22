import express, { Request, Response, NextFunction, Router } from 'express';

import Genre from '../../models/genre';

const jsonParser = express.json();
const router: Router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    Genre.find()
        .then((items) => {
            return res.status(200).json({ items });
        })
        .catch((error) => {
            console.log('Error: ', error);
            return res.status(404).json({ message: 'ERROR' });
        });
});

export default router;
