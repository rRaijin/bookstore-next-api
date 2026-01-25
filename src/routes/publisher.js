import express from 'express';
import { saveFile } from './files.js';
import Publisher from '../models/publisher.js';
import User from '../models/user.js';


const jsonParser = express.json();
const router = new express.Router();


router.get('/', async (req, res, next) => {
    let items;
    try {
        items = await Publisher.find().populate({
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


router.put('/', jsonParser, async (req, res) => {
    console.log('form body: ', req.body);
    const {_id, userId, userEmail, firstName, lastName, bio, year, pseudonym, isEditorInChief, picture, imageFolder } = req.body;

    let publisher;
    if (_id) {
        publisher = await Publisher.findById(_id);
        if (!publisher) {
            return res.status(404).json({ error: 'Автор не находится' });
        }
        publisher.bio = bio,
        publisher.year = year;
        publisher.picture = picture;
        publisher.pseudonym = pseudonym;
        publisher.isEditorInChief = isEditorInChief

        let user;
        if (userId) {
            // update exists
            user = await User.findById(userId._id);
            if (!user) {
                return res.status(404).json({ error: 'Все пропало шеф' });
            } else {
                user.userEmail = userId.userEmail;
                user.firstName = userId.firstName;
                user.lastName = userId.lastName;
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
            publisher.userId = savedUser._id;
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
        publisher = new Publisher({
            picture,
            year,
            bio,
            userId: savedUser._id,
            firstName,
            lastName,
            userEmail,
            pseudonym,
            isEditorInChief
        });
    }

    if (picture) {
        await saveFile(picture, imageFolder);
    }
    await publisher.save();
    return res.status(200).json({message: 'OK', item: publisher});
});

export default router;