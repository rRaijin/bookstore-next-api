import { rateLimit } from 'express-rate-limit';

const limitHandler = rateLimit({
    windowMs: 60000, // период проверки кол-ва запросов в мс - 1min
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => req.headers['my-secret-token'] === 'korowka',
    message: {
        error: 'До побачення',
    },
});

export default limitHandler;
