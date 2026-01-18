import express from 'express';
import { saveFile } from './files.js';
import Author from '../models/author.js';
import User from '../models/user.js';

const jsonParser = express.json();
const router = new express.Router();

router.get('/', jsonParser, async (req, res) => {
    console.log('FETCH 12312312');
    let i = 0;
    while (i < 300) {
        let firstName = 'first name # ' + (i + 1);
        let lastName = 'last Name # ' + (i + 1);
        let userEmail = 'testauthor' + (i + 1) + '@gmail.com';
        let bio = 'Test bio for author #' + (i + 1);

        const user = new User({
            firstName,
            lastName,
            userEmail,
            password: '12345678',
            isAuthor: true
        });

        const savedUser = await user.save();

        const author = new Author({
            bio,
            userId: savedUser._id
        });

        await author.save(); 

        console.log('Iteration: ', i);
        i++;
    }
    return res.status(200).json({ message: 'OK' });
});

export default router;
