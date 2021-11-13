require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const Sequelize = require('sequelize');

const getDBConfiguration = require('./controller/dbConfiguration').getDBConfiguration()
const getObjectStoreConfiguration = require('./controller/objectStoreConfiguration').getObjectStoreConfiguration()

const port = process.env.PORT || 9001

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Configuration Microservice is running in " + process.env.ENVIRONMENT)
})

app.post('/getDBConfiguration', async (req, res) => {

    console.log("Success!");

    const sequelize = new Sequelize(getDBConfiguration.dbname, getDBConfiguration.dbuser, getDBConfiguration.dbpassword, {
      host: getDBConfiguration.dbhost,
      port: getDBConfiguration.dbport,
      dialect: 'postgres',
      dialectOptions: getDBConfiguration.dialectOptions
    });

    let sequelizeAuthenticate = await sequelize.authenticate()
    
    let tableDefinition = req.body.tabledefinition
    let tableName = req.body.tablename
    let tableModel = require('./models/model').getModel(sequelize, tableName, tableDefinition)
    let syncModel = await tableModel.sync()

    let modelData = await tableModel.findAll({
      attributes: Object.keys(tableDefinition)
  })
  res.send(modelData)

})

app.get('/getObjectStoreConfiguration', (req, res) => {
  const destinationFolderPath = getObjectStoreConfiguration.destinationFolderPath
  res.send(destinationFolderPath)
})

app.listen(port, () => {
  
  console.log("Configuration Microservice is running in " + port)
})
