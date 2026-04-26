import { Request, Response } from 'express';

import { Newspaper } from '@/models/newspaper';

class NewspaperController {
    public paginated = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        const { pageNum, perPage, countItems, filter } = req.body;
        let query: any = {};

        if (filter && filter.hasOwnProperty('desc') && filter.desc !== '') {
            query['$or'] = [
                { newspaperName: { $regex: filter.desc, $options: 'i' } },
                { description: { $regex: filter.desc, $options: 'i' } },
            ];
        }

        const totalDocuments = countItems && countItems !== 0 ? countItems : await Newspaper.countDocuments(query);

        let items: any;
        try {
            items = await Newspaper.aggregate([
                {
                    $match: {},
                },
                {
                    $lookup: {
                        from: 'publishers',
                        localField: 'editors',
                        foreignField: '_id',
                        as: 'editors',
                    },
                },
                {
                    $match: query,
                },
                {
                    $project: {
                        _id: 1,
                        newspaperName: 1,
                        description: 1,
                        year: 1,
                        picture: 1,
                        editors: 1,
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
            items = await Newspaper.find().populate({ path: 'editors' });
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
            item = await Newspaper.findById(id).populate({ path: 'editors' });
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
            const { _id, newspaperName, description, year, editors } = req.body;

            let newspaper: any;

            if (_id) {
                newspaper = await Newspaper.findById(_id);
                if (!newspaper) {
                    return res.status(404).json({ error: 'Газета не найдена' });
                }
                newspaper.newspaperName = newspaperName;
                newspaper.description = description;
                newspaper.year = year;
                newspaper.editors = editors;
            } else {
                newspaper = new Newspaper({
                    newspaperName,
                    description,
                    year,
                    editors,
                });
            }

            await newspaper.save();
            return res.status(200).json({ message: 'OK', item: newspaper });
        } catch (error) {
            console.error('Error in PUT /api/newspapers:', error);
        } finally {
            console.log('OK!!!');
        }
    };

    public remove = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        const id = req.params.id as string;
        try {
            const newspaper = await Newspaper.findByIdAndDelete(id);
            if (!newspaper) {
                return res.status(404).json({ error: 'Газета не найдена' });
            }
            return res.status(200).json({ message: 'OK' });
        } catch (error) {
            console.error('Error in DELETE /api/newspapers:', error);
            return res.status(500).json({ message: 'ERROR' });
        }
    };
}

export default new NewspaperController();