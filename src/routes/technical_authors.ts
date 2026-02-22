import express, { Request, Response, Router } from 'express';
import { saveFile } from './v1/files';
import Author from '../models/author';
import User from '../models/user';

const jsonParser = express.json();
const router: Router = Router();

router.get('/', jsonParser, async (req: Request, res: Response) => {
    console.log('FETCH 12312312');
    let i = 0;
    while (i < 300) {
        let firstName = 'first name # ' + (i + 1);
        let lastName = 'last Name # ' + (i + 1);
        let userEmail = 'testauthor' + (i + 1) + '@gmail.com';
        let bio = 'Test bio for author #' + (i + 1);

        const user: any = new User({
            firstName,
            lastName,
            userEmail,
            password: '12345678',
            isAuthor: true,
        });

        const savedUser = await user.save();

        const author: any = new Author({
            bio,
            userId: savedUser._id,
        });

        await author.save();

        console.log('Iteration: ', i);
        i++;
    }
    return res.status(200).json({ message: 'OK' });
});

export default router;
