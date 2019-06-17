const Sequelize = require('sequelize');
const database = require('../database');

const Campuses = database.define('campuses', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },

    campusname:{
        type:Sequelize.TEXT
    },

    location:{
        type: Sequelize.TEXT
    },

    description:{
        type:Sequelize.TEXT
    },

    img:{
        type:Sequelize.TEXT
    }
}, 

{
    timestamps: false

});

module.exports = Campuses;