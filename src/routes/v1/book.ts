import express, { Router, Request, Response, NextFunction } from 'express';

import Book from '../../models/book';
import Author from '../../models/author';

const jsonParser = express.json();
const router: Router = express.Router();

interface Filter {
    desc?: string;
    price?: number;
}

interface BooksPostBody {
    pageNum: number;
    perPage: number;
    countItems?: number;
    filter?: Filter;
}

router.post('/', async (req: Request<{}, {}, BooksPostBody>, res: Response) => {
    const { pageNum, perPage, countItems, filter } = req.body;

    console.log('BODY: ', req.body);

    let query: any = {};

    if (filter && filter.desc && filter.desc !== '') {
        query['$or'] = [{ bookName: { $regex: filter.desc, $options: 'i' } }, { description: { $regex: filter.desc, $options: 'i' } }];
    }

    if (filter && filter.price !== undefined && filter.price !== null && filter.price >= 0) {
        query['price'] = filter.price;
    }

    let items;

    const totalDocuments = countItems && countItems !== 0 ? countItems : await Book.countDocuments(query);

    console.log('total: ', totalDocuments);
    console.log('QUERY: ', query);

    try {
        items = await Book.find(query)
            .populate({
                path: 'authorId',
                populate: {
                    path: 'userId',
                    model: 'User',
                },
            })
            .populate('genres')
            .skip((pageNum - 1) * perPage)
            .limit(perPage);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(404).json({ message: 'ERROR' });
    }

    if (!items) {
        return res.status(404).json({ message: 'No items' });
    }

    return res.status(200).json({ items, countItems: totalDocuments });
});

/* ===================== DELETE ===================== */

router.delete('/books', (req: Request, res: Response) => {
    console.log('DELETE: ', req.query, 'BODY: ', req.body);
    const numbers = [1, 2, 3, 4, 5];
    return res.status(200).json({ numbers });
});

router.get('/authors', async (req: Request, res: Response) => {
    try {
        const authors = await Author.find();
        return res.status(200).json({ authors });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ message: 'Error fetching authors' });
    }
});

/* ===================== CREATE / UPDATE BOOK ===================== */

interface BookBody {
    _id?: string;
    bookName: string;
    description: string;
    year: number;
    authorId: any;
    price: number;
    pages: number;
    picture: string;
    imageFolder?: string;
    genres: any[];
}

router.put('/', jsonParser, async (req: Request<{}, {}, BookBody>, res: Response) => {
    const { bookName, description, year, authorId, price, pages, picture, imageFolder, genres } = req.body;

    let book;

    if (req.body._id) {
        book = await Book.findById(req.body._id);

        if (book) {
            book.bookName = bookName;
            book.description = description;
            book.authorId = authorId;
            book.year = year;
            book.price = price;
            book.pages = pages;
            book.picture = picture;
            book.genres = genres;
        }
    } else {
        book = new Book({
            bookName,
            description,
            year,
            price,
            pages,
            picture,
            authorId,
            genres,
        });
    }

    console.log('BOOK: ', book);

    await book.save();

    return res.status(200).json({ message: 'OK', item: book });
});

export default router;
