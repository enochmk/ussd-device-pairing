import express from 'express';
import config from 'config';
import cors from 'cors';
import morgan from 'morgan';
import xmlBodyParser from 'express-xml-bodyparser';

import { connectRedis } from './databases/redis';
import errorHandler from './middlewares/errorHandler.middleware';
import logger from './utils/loggers/logger';
import routes from './routes';

const app = express();
const mode = config.get<string>('env');
const port = config.get<number>('port');

app.use(cors());
app.use(morgan('tiny'));
app.use(xmlBodyParser());
app.use(routes);
app.use(errorHandler);

connectRedis();

app.listen(port, () => {
	const message = `USSD is running in mode: ${mode} at http://localhost:${port}`;
	logger.info(message);
});
