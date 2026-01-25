import express from 'express';

import User from '../models/user.js';


const jsonParser = express.json();
const router = new express.Router();

router.get('/', async (req, res, next) => {
    let items;
    try {
        items = await User.find();
    } catch (error) {
        console.log('Error: ', error);
    }
    if (!items) {
        return res.status(404).json({message: 'No items'});
    }
    return res.status(200).json({items});
});

export default router;
