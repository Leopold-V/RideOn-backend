const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet  = require('helmet');
require('dotenv').config();
const middlewares = require('./middlewares');
const bodyParser = require('body-parser');
const code = require('./src/routes/code.route.js')

const app = express();
var corsOptions = {
    origin: '*', //adress of the frontend
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(bodyParser.json({type : 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/v1', (req, res) => {
    res.json({
        message: 'Codeshare entry point API'
    })
})

app.use('/api/v1/code', code);

app.use(middlewares.errorHandler);
app.use(middlewares.notFound);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})