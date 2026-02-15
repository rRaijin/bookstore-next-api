import express, { Request, Response, NextFunction, Router } from 'express';

import User from '../../models/user';

const jsonParser = express.json();
const router: Router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    let items: any;
    try {
        items = await User.find();
    } catch (error) {
        console.log('Error: ', error);
    }
    if (!items) {
        return res.status(404).json({message: 'No items'});
    }
    return res.status(200).json({items});
});

export default router;
