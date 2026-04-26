import cors from 'cors';
import express from 'express';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import locale from 'locale';

import { connectDb, disconnectFromDb } from './lib/mongoose';
import config from './config';

import type { CorsOptions } from 'cors';

import v1router from './routes/v1/index';
import routerTechnical from './routes/technical';
import limitHandler from './lib/express_rate_limiter';

const app = express();
app.set('trust proxy', 1);
const corsOptions: CorsOptions = {
    // origin - это и есть адрес откуда пришел запрос
    origin(origin, callback) {
        if (!origin || config.WHITELIST.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Request not allowed by CORS from origin: ${origin}`));
            // logger error
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cookieSession({
        name: 'session',
        keys: ['qwerty'],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: config.NODE_ENV === 'local' ? false : true,
        sameSite: 'lax',
        // domain: 'api.bookstore',
        httpOnly: true,
    }),
);
app.use(
    compression({
        treshhold: 1024, // будет сжимать ответ(response)  больше 1 Кб
    }),
);

app.use(limitHandler);

// app.use(
//     locale(['en', 'en_US'], 'en')
// )

// app.use(myMiddleware);

(async () => {
    try {
        await connectDb();
        app.get('/ping', (req, res) => res.json({ status: 'ok' }));
        app.use('/api/v1', v1router);
        app.use('/api/technical', routerTechnical);
        app.listen(config.PORT, () => {
            console.log(`> Server listening at ${config.BASE_URL}:${config.PORT} as ${process.env.NODE_ENV}`);
        });
    } catch (err) {
        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();
const handleServerShutdown = async () => {
    try {
        await disconnectFromDb();
        console.log('Server SHUTDOWN');
        process.exit(0);
    } catch (err) {
        console.log('Error during server shutdown: ', err);
    }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
