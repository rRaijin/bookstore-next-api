import express from 'express';

import Genre from '../models/genre.js';


const jsonParser = express.json();
const router = new express.Router();


router.get('/', async (req, res, next) => {
    Genre.find().then((items) => {
        return res.status(200).json({items});
    }).catch((error) => {
        console.log('Error: ', error);
        return res.status(404).json({message: 'ERROR'});
    });
});

export default router;
