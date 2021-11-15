require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const Sequelize = require("sequelize");
const COS = require("ibm-cos-sdk");

const getDBConfiguration =
  require("./controller/dbConfiguration").getDBConfiguration();
const getObjectStoreConfiguration =
  require("./controller/objectStoreConfiguration").getObjectStoreConfiguration();

app.use(cors());

const port = process.env.PORT || 8002;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Configuration Microservice is running in " + process.env.ENVIRONMENT
  );
});

app.post("/getDBConfiguration", async (req, res) => {
  console.log("Success!");
  let modelData
  if (req.body.query === "findAll") {
    const sequelize = new Sequelize(
      getDBConfiguration.dbname,
      getDBConfiguration.dbuser,
      getDBConfiguration.dbpassword,
      {
        host: getDBConfiguration.dbhost,
        port: getDBConfiguration.dbport,
        dialect: "postgres",
        dialectOptions: getDBConfiguration.dialectOptions,
      }
    );

    let sequelizeAuthenticate = await sequelize.authenticate();

    let tableDefinition = req.body.tabledefinition;
    let tableName = req.body.tablename;
    let tableModel = require("./models/model").getModel(
      sequelize,
      tableName,
      tableDefinition
    );
    let syncModel = await tableModel.sync();

     modelData = await tableModel.findAll({
      attributes: Object.keys(tableDefinition),
    });
    res.send(modelData);
  } else if (req.body.query === "findbyId") {
    modelData = await getVideobyId(req,res);
    res.setHeader("Content-Type" , modelData.header['Content-Type'])
    res.send(modelData.body);

  }

  
});

const getVideobyId = async (req,res) => {
  const sequelize = new Sequelize(
    getDBConfiguration.dbname,
    getDBConfiguration.dbuser,
    getDBConfiguration.dbpassword,
    {
      host: getDBConfiguration.dbhost,
      port: getDBConfiguration.dbport,
      dialect: "postgres",
      dialectOptions: getDBConfiguration.dialectOptions,
    }
  );

  let sequelizeAuthenticate = await sequelize.authenticate();

  let tableDefinition = req.body.tabledefinition;
  let tableName = req.body.tablename;
  let tableModel = require("./models/model").getModel(
    sequelize,
    tableName,
    tableDefinition
  );
  let syncModel = await tableModel.sync();

  let modelData = await tableModel.findAll({
    attributes: Object.keys(tableDefinition),
    where: {
      footageid: req.body.id,
    },
  });
  let objResponse = await getObjectStoreConfigurationfunc(modelData[0].dataValues.footage_key) 

  return objResponse
};

const getObjectStoreConfigurationfunc = async (key) => {
  const config = {
    endpoint: getObjectStoreConfiguration.endpoint,
    apiKeyId: getObjectStoreConfiguration.apiKeyId,
    serviceInstanceId: getObjectStoreConfiguration.serviceInstanceId,
  };

  const cos = new COS.S3(config);
 let cosresponse = await cos
    .getObject({ Bucket: "roks-c5ooaecl02kmaahb914g-8c2f", Key: key })
    .promise()


    // .then((result) => {
      let objResponse = {
        header :
        {
          "Content-Type" : "video/mp4"
        },
        body : cosresponse.Body
      }
      return objResponse
      // res.send(result.Body.toString('base64') )
    // })
    // .catch((e) => {
    //   console.error(`ERROR: ${e.code} - ${e.message}\n`);
    // });

  // const destinationFolderPath = getObjectStoreConfiguration.destinationFolderPath
  // res.send(destinationFolderPath)
};

app.listen(port, () => {
  console.log("Configuration Microservice is running in " + port);
});
