import express, { Request, Response, Router } from 'express';
import { saveFile } from './files';
import Newspaper from '../../models/newspaper';
import mongoose from 'mongoose';

const jsonParser = express.json();
const router: Router = Router();
const ObjectId = mongoose.Types.ObjectId;

router.get('/', (req: Request, res: Response) => {
    // console.log('DEBUG SERVER: ', req.query);
    return Newspaper.find()
        .then((items: any[]) => {
            // console.log('items: ', items);
            if (items.length === 0) {
                return res.status(200).json({ message: 'Газеты не найдены', items });
            } else {
                return res.status(200).json({ items });
            }
        })
        .catch((err: any) => {
            return res.json({ message: 'Ошибка при получении газет' });
        });
});

interface NewspaperBody {
    _id?: string;
    newspaperName: string;
    description: string;
    year: number;
    picture?: string;
    imageFolder?: string;
    publisher?: any;
    editors?: any[];
}

router.put('/', jsonParser, async (req: Request<{}, {}, NewspaperBody>, res: Response) => {
    console.log('form body: ', req.body);
    const { newspaperName, description, year, picture, imageFolder, publisher, editors } = req.body;
    // const author = await Author.findById(authorId._id);
    // Определяем нужно создать новую книгу или обновить существующую
    // Для существующей в body прийдет поле "_id"
    let newspaper: any;
    if (req.body._id) {
        newspaper = await Newspaper.findById(req.body._id);
        if (newspaper) {
            newspaper.newspaperName = newspaperName;
            newspaper.description = description;
            newspaper.year = year;
            // newspaper.picture = picture;
            newspaper.publisher = publisher;
            newspaper.editors = editors;
        } else {
            // error
        }
    } else {
        newspaper = new Newspaper({
            newspaperName,
            description,
            year,
            // picture,
            // publisher,
            // editorInChief,
            editors: [new ObjectId('678398437d4ab7b553d4dcbb'), new ObjectId('6783a57309d075f816b7278f')],
        });
    }
    console.log('newspaper: ', newspaper);
    // await saveFile(picture, imageFolder);
    await newspaper.save();
    return res.status(200).json({ message: 'OK', item: newspaper });
});

export default router;
