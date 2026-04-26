import { Request, Response } from 'express';

import { Book } from '@/models/book';

class BookController {
    public paginated = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        const { pageNum, perPage, countItems, filter } = req.body;
        let query: any = {};

        if (filter && filter.hasOwnProperty('desc') && filter.desc !== '') {
            query['$or'] = [
                { bookName: { $regex: filter.desc, $options: 'i' } },
                { description: { $regex: filter.desc, $options: 'i' } },
            ];
        }

        const totalDocuments = countItems && countItems !== 0 ? countItems : await Book.countDocuments(query);

        let items: any;
        try {
            items = await Book.aggregate([
                {
                    $match: {},
                },
                {
                    $lookup: {
                        from: 'authors',
                        localField: 'authorId',
                        foreignField: '_id',
                        as: 'authorId',
                    },
                },
                {
                    $unwind: { path: '$authorId' },
                },
                {
                    $lookup: {
                        from: 'genres',
                        localField: 'genres',
                        foreignField: '_id',
                        as: 'genres',
                    },
                },
                {
                    $match: query,
                },
                {
                    $project: {
                        _id: 1,
                        bookName: 1,
                        slug: 1,
                        description: 1,
                        year: 1,
                        price: 1,
                        picture: 1,
                        pages: 1,
                        genres: 1,
                        'authorId._id': 1,
                        createdAt: 1,
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $skip: (pageNum - 1) * perPage,
                },
                {
                    $limit: perPage,
                },
            ]);
        } catch (error) {
            console.log('Error: ', error);
            return res.status(404).json({ message: 'ERROR' });
        }

        if (!items) {
            return res.status(404).json({ message: 'No items' });
        }

        return res.status(200).json({ items, countItems: totalDocuments });
    };

    public list = async (req: Request, res: Response, next: Function) => {
        let items: any;
        try {
            items = await Book.find()
                .populate({ path: 'authorId' })
                .populate({ path: 'genres' });
        } catch (error) {
            console.log('Error: ', error);
        }

        if (!items) {
            return res.status(404).json({ message: 'No items' });
        }

        return res.status(200).json({ items });
    };

    public single = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        const id = req.params.id as string;
        let item: any;
        try {
            item = await Book.getFullBook(id);
        } catch (error) {
            console.log('Error: ', error);
            return res.status(404).json({ message: 'ERROR' });
        }

        if (!item) {
            return res.status(404).json({ message: 'No item' });
        }

        return res.status(200).json({ item });
    };
    public createUpdate = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        try {
            console.log('form body: ', req.body);
            const { _id, bookName, description, year, price, pages, authorId, genres } = req.body;

            let book: any;

            if (_id) {
                book = await Book.findById(_id);
                if (!book) {
                    return res.status(404).json({ error: 'Книга не найдена' });
                }
                book.bookName = bookName;
                book.description = description;
                book.year = year;
                book.price = price;
                book.pages = pages;
                book.authorId = authorId;
                book.genres = genres;
            } else {
                book = new Book({
                    bookName,
                    description,
                    year,
                    price,
                    pages,
                    authorId,
                    genres,
                });
            }

            await book.save();
            return res.status(200).json({ message: 'OK', item: book });
        } catch (error) {
            console.error('Error in PUT /api/books:', error);
        } finally {
            console.log('OK!!!');
        }
    };

    public remove = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        const { id } = req.params;
        try {
            const book = await Book.findByIdAndDelete(id);
            if (!book) {
                return res.status(404).json({ error: 'Книга не найдена' });
            }
            return res.status(200).json({ message: 'OK' });
        } catch (error) {
            console.error('Error in DELETE /api/books:', error);
            return res.status(500).json({ message: 'ERROR' });
        }
    };
}

export default new BookController();