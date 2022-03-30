import express from 'express';
import config from 'config';
import cors from 'cors';
import morgan from 'morgan';
import xmlBodyParser from 'express-xml-bodyparser';

import logger from './utils/loggers/logger';
import errorHandler from './middlewares/errorHandler.middleware';
import routes from './routes';

const port = config.get<number>('port');
const mode = config.get<string>('env');
const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(xmlBodyParser());
app.use(routes);
app.use(errorHandler);

app.listen(port, () => {
	const message = `USSD is running in mode: ${mode} at http://localhost:${port}`;
	logger.verbose(message);
});
