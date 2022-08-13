import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { errorHandler, notFound } from './middlewares.js';
import bodyparser from 'body-parser';
import rateLimit from 'express-rate-limit'

import userRoute from './src/routes/user.route.js';

const app = express();
let corsOptions = {
    origin: 'http://localhost:19006', //adress of the frontend
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);
app.use(bodyparser.json({type : 'application/json'}));
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(json());

app.get('/api/v1', (req, res) => {
    res.json({
        message: 'RideOn entry point API'
    })
})

app.use('/api/v1/users', userRoute);

app.use(errorHandler);
app.use(notFound);

app.listen(process.env.NODE_PORT, () => {
    console.log(`Server is running on port ${process.env.NODE_PORT}`);
})