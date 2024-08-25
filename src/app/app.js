const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('../router/user.router');

const app = express();

// CORS CONFIGs
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', userRouter);

app.get('/', (req, res) => {
    let status = {
        status: 'OK',
        message: 'Backend Service is running',
    };
    res.json(status);
});

module.exports = app;
