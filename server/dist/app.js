import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js';
export const createApp = () => {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    app.get('/health', (_request, response) => {
        response.json({ ok: true, service: 'ai-assessment-creator-api' });
    });
    app.use('/api', apiRouter);
    app.use(notFoundMiddleware);
    app.use(errorMiddleware);
    return app;
};
