import express, { Request, Response, Router } from 'express';

import { saveFile } from '../routes/v1/files';
import { Book } from '@/models/book';
import { Author } from '@/models/author';

const jsonParser = express.json();
const router: Router = Router();

const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

router.get('/', jsonParser, async (req: Request, res: Response) => {
    console.log('FETCH');
    let i = 0;
    while (i < 300) {
        let bookName = 'Test book # ' + i + 1;
        let description = 'Test description # ' + i + 1;
        let year = 1800 + i + 9;
        let price = 10000 - i * 4;
        let pages = 50 + i * 5;

        const book: any = new Book({
            bookName,
            description,
            year,
            price,
            pages,
            picture: 'a21861ea15e9ec0a97be0a40b0370e79.jpg',
            authorId: '6587ff1b900c14d25cf1ae98',
            genres: ['6587ff1b900c14d25cf1ae88'],
        });
        await book.save();
        console.log('Iteration: ', i);
        i++;
    }
    return res.status(200).json({ message: 'OK' });
});

router.get('/replace-date-to-timestamps', jsonParser, async (req: Request, res: Response) => {
    console.log('Start change authors dates');
    const authors = await Author.find();
    for (let i = 0; i < authors.length; i++) {
        const author = authors[i];

        await Author.updateOne(
            { _id: author._id },
            {
                $set: {
                    // createdAt: new Date(author.createdAt).getTime(),
                    // updatedAt: new Date(author.updatedAt).getTime(),
                    age: getRandomInt(20, 90),
                },
            },
        );
    }

    return res.status(200).json({ message: 'OK' });
});

export default router;
