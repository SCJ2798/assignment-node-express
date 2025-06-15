require('dotenv').config();
const {routes} = require('./routes');
const {sequelize} = require('./models');
const { Sequelize } = require('sequelize');
const express = require('express');
const cors = require('cors');

// initialized express
const app = express();

// setup middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api',routes);
// 
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async (err) =>{
    try {
        console.log(`SERVER RUNNING ON ${PORT}`);
        await sequelize.authenticate();
        console.log(`SEQUELIZE AUTHENTICATE`); 
        Sequelize.afterSync();
        console.log(`SEQUELIZE AFTER SYNC`); 
    } catch (error) {
        console.log(error)
    }
});





