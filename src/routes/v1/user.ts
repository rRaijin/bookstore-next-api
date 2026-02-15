import { Request, Response, NextFunction, Router } from 'express';

import { User } from '@/models/user';

const router: Router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    let items: any;
    try {
        items = await User.find();
    } catch (error) {
        console.log('Error: ', error);
    }
    if (!items) {
        return res.status(404).json({ message: 'No items' });
    }
    return res.status(200).json({ items });
});

router.post('/by-id', async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.userId);

    if (user) {
        console.log('ok: ', user.firstName, user.lastName);
        return res.status(200).json({
            success: true,
            data: [user ? user.toObject() : null],
        });
    }
});

router.put('/new', async (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
        firstName: 'Vasya',
        lastName: 'Pups',
    });

    user.save().then((item) => {
        return res.status(200).json({
            success: true,
            data: [item ? item.toObject() : null],
        });
    });
});

export default router;
