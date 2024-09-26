const express = require('express');
const mongoose = require('mongoose');
const DBconnection = require('./Config/Database');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRoutes = require("./Routes/UserRoute")
const postRoutes = require ('./Routes/PostRoute')








const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/user', userRoutes); 
app.use('/post',postRoutes)



DBconnection();

app.listen(4000, () => {
    console.log('Server is Running');
});
