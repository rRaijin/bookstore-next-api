import express from 'express';

import { saveFile } from './files.js';
import Author from '../models/author.js';
import User from '../models/user.js';


const jsonParser = express.json();
const router = new express.Router();

router.post('/', async (req, res) =>  {
    const { pageNum, perPage, countItems, filter } = req.body;
    // console.log('Author Body', req.body);
    let query = {};
    if (filter && filter.hasOwnProperty('desc') && filter.desc !== '') {
        query['$or'] = [
            {bio: {'$regex' : filter.desc, '$options' : 'i'}},
            {'userId.lastName' : {'$regex' : filter ? filter.desc : '', '$options' : 'i'}}
        ]
    } else {
        
    }
    let items;

    const totalDocuments = countItems && countItems !== 0 ? countItems : await Author.countDocuments(query);
    // console.log('total: ', totalDocuments)
    console.log('QUERY: ', query);

    try {
        items = await Author.aggregate([
            {
                $match: {} // объект параметров запроса
            },
            {
                $lookup: { // выполняем 'join', оператор присоединения
                    from: 'users', // находим в таблице 'users' 
                    localField: 'userId', // по полю 'userId'
                    foreignField: '_id', // юзера c соотв. идентификатором
                    as: 'userId' // полученный результат (массив, из одного объекта) сохраняем в переменную 'userObj' (массив)
                }
            },
            {
                $unwind: {path: '$userId'} // распечатівает массив
            },
            {
                $match: query // в объект 'query' мы передаем ранее сформированный фильтр
            },
            {
                $project: {
                    _id: 1, 
                    picture: 1, 
                    bio: 1, 
                    'userId.firstName': 1, 
                    'userId.lastName': 1
                }
            },
            {
                $sort: {'userId.firstName': -1}
            },
            {
                $addFields: {
                    cats: 20,
                    // bookCategoriesCnt: {$size: '$genres'}
                }
            },
            {
                $skip: (pageNum - 1) * perPage
            },
            {
                $limit: perPage
            }
        ]);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(404).json({message: 'ERROR'});
    }
    if (!items) {
        return res.status(404).json({message: 'No items'});
    }
    console.log('items: ', items);
    return res.status(200).json({items, countItems: totalDocuments});
});

router.get('/', async (req, res, next) => {
    let items;
    try {
        items = await Author.find().populate({
            path: 'userId'
        });
    } catch (error) {
        console.log('Error: ', error);
    }
    if (!items) {
        return res.status(404).json({message: 'No items'});
    }
    return res.status(200).json({items});
});

router.post('/', async (req, res, next) => {
    const { pageNum, perPage, countItems } = req.body;
    console.log('BODY: ', req.body);
    // return Book.aggregate([
    //     {
    //         $match: {}
    //     },
    //     {

    //     }
    // ])
    let items;
    console.log('est: ', countItems);
    if (!countItems) {
        console.log('OK: ', countItems)
    }
    const totalDocuments = countItems ? countItems : await Author.estimatedDocumentCount();
    try {
        items = await Author.find({}).populate({path: 'userId',model: 'User'
        }).skip((pageNum - 1) * perPage).limit(perPage);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(404).json({message: 'ERROR'});
    }
    if (!items) {
        return res.status(404).json({message: 'No items'});
    }
    return res.status(200).json({items, countItems: totalDocuments});
});


router.put('/', jsonParser, async (req, res) => {
    try {
        console.log('form body: ', req.body);
        const { _id, firstName, lastName, userEmail, bio, userId } = req.body;

        let author;
        if (_id) {
            author = await Author.findById(_id);
            if (!author) {
                return res.status(404).json({ error: 'Автор не находится' });
            }
            author.bio = bio;

            let user;
            if (userId) {
                // update exists
                user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ error: 'Все пропало шеф' });
                } else {
                    user.userEmail = userEmail;
                    user.firstName = firstName;
                    user.lastName = lastName;
                    user.save();
                }
            } else {
                // create new user
                user = new User({
                    firstName,
                    lastName,
                    userEmail,
                    password: '12345678',
                    isAuthor: true
                });
                const savedUser = await user.save();
                author.userId = savedUser._id;
            }
        } else {
            const user = new User({
                firstName,
                lastName,
                userEmail,
                password: '12345678',
                isAuthor: true
            });
            const savedUser = await user.save();
            author = new Author({
                bio,
                userId: savedUser._id
            });
        }
        await author.save();
        return res.status(200).json({ message: 'OK', item: author });
    } catch (error) {
        console.error('Error in PUT /api/authors:', error);
    } finally {
        console.log('OK!!!')
    }
});


export default router;

