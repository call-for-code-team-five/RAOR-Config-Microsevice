
const Sequelize = require('sequelize');

let dbname, dbuser, dbpassword, dbport, dbhost, dbssl, dialectOptions
let sequelize

const getDBConfiguration = () => {
    if (process.env.ENVIRONMENT == "SAPBTP" || process.env.ENVIRONMENT == "IBMCLOUD") { //// If the Configuration Microservice is running in SAP Cloud
        console.log('VCAP_Services')
        console.log(JSON.parse(process.env.VCAP_SERVICES))
        // Return DB Details from VCAP_Services 
        dbname = JSON.parse(process.env.VCAP_SERVICES)["postgresql-db"][0]["credentials"]["dbname"]
        dbuser = JSON.parse(process.env.VCAP_SERVICES)["postgresql-db"][0]["credentials"]["username"]
        dbpassword = JSON.parse(process.env.VCAP_SERVICES)["postgresql-db"][0]["credentials"]["password"]
        dbport = JSON.parse(process.env.VCAP_SERVICES)["postgresql-db"][0]["credentials"]["port"]
        dbhost = JSON.parse(process.env.VCAP_SERVICES)["postgresql-db"][0]["credentials"]["hostname"]
        dbssl = true
        dialectOptions = {
            ssl: {
                require: dbssl,
                rejectUnauthorized: false
            }
        }

    } else if (process.env.ENVIRONMENT == "Local") { //// If the Configuration Microservice is running in Local

        // Return DB Details from Local Environment Variables
        dbname = process.env.DBNAME
        dbuser = process.env.DBUSER
        dbpassword = process.env.DBPASSWORD
        dbport = 5432
        dbhost = 'localhost'
        dbssl = false
        dialectOptions = {}

    }

    sequelize = new Sequelize(dbname, dbuser, dbpassword, {
        host: dbhost,
        dialect: 'postgres',
        port: dbport,
        logging: false,
        dialectOptions: dialectOptions
    });

    return {
        sequelize: sequelize,
        dbname: dbname,
        dbuser: dbuser,
        dbpassword: dbpassword,
        dbhost: dbhost,
        dbport: dbport,
        dialectOptions: dialectOptions
    }
}


module.exports = { getDBConfiguration }