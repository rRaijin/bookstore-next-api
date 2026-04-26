import { Request, Response } from 'express';

import { User } from '@/models/user';

class UserController {
    public paginated = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        const { pageNum, perPage, countItems, filter } = req.body;
        let query: any = {};

        if (filter && filter.hasOwnProperty('desc') && filter.desc !== '') {
            query['$or'] = [
                { firstName: { $regex: filter.desc, $options: 'i' } },
                { lastName: { $regex: filter.desc, $options: 'i' } },
                { userEmail: { $regex: filter.desc, $options: 'i' } },
            ];
        }

        const totalDocuments = countItems && countItems !== 0 ? countItems : await User.countDocuments(query);

        let items: any;
        try {
            items = await User.aggregate([
                {
                    $match: query,
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        userEmail: 1,
                        isAuthor: 1,
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
            items = await User.find();
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
            item = await User.findById(id);
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
            const { _id, firstName, lastName, userEmail, password, isAuthor } = req.body;

            let user: any;

            if (_id) {
                user = await User.findById(_id);
                if (!user) {
                    return res.status(404).json({ error: 'Пользователь не найден' });
                }
                user.firstName = firstName;
                user.lastName = lastName;
                user.userEmail = userEmail;
                user.isAuthor = isAuthor;
                if (password) {
                    user.password = password;
                }
            } else {
                const savedUser = await User.newUser({
                    firstName,
                    lastName,
                    userEmail,
                    password: password ?? '12345678',
                    isAuthor: isAuthor ?? false,
                });

                if (!savedUser) {
                    return res.status(400).json({ error: 'Не удалось создать пользователя' });
                }

                return res.status(200).json({ message: 'OK', item: savedUser });
            }

            await user.save();
            return res.status(200).json({ message: 'OK', item: user });
        } catch (error) {
            console.error('Error in PUT /api/users:', error);
        } finally {
            console.log('OK!!!');
        }
    };

    public remove = async (req: Request, res: Response, next: Function): Promise<void | Response<any, Record<string, any>>> => {
        const id = req.params.id as string;
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            return res.status(200).json({ message: 'OK' });
        } catch (error) {
            console.error('Error in DELETE /api/users:', error);
            return res.status(500).json({ message: 'ERROR' });
        }
    };
}

export default new UserController();