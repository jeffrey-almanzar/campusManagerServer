const Sequelize = require('sequelize');
const database = require('../database');

const Students =  database.define('students', {
    //create name and material as strings,
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    name:{type: Sequelize.TEXT} ,
    //height as an integer,
    campus:{type:  Sequelize.INTEGER},
    //and brim as a true/false
    gpa: {type:Sequelize.FLOAT},

    url:Sequelize.TEXT},

    {
        timestamps: false
    
   });

   module.exports = Students;