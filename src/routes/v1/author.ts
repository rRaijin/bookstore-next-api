import express, { Router } from 'express';

import AuthorController from '@/controllers/AuthorController';

const jsonParser = express.json();
const router: Router = express.Router();

/**
 * Возвращает паджинированный список
 */
router.post('/', AuthorController.paginated);

router.get('/', AuthorController.list);

/**
 * Учебный экземпляр не через аггрегацию
 */
// router.post('/', AuthorController.teachExampleNoAggregation);

router.put('/', jsonParser, AuthorController.createUpdate);

export default router;
