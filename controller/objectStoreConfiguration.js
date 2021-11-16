const fs = require('fs');
const path = require('path');

const getObjectStoreConfiguration = () => {
    if (process.env.ENVIRONMENT == "SAPBTP") { //// If the Configuration Microservice is running in SAP Cloud

        // Return Object Store Details from VCAP_Services 
        return {
            StorageType: "objectStore",
            accessKeyId: env["objectstore"][0]["credentials"]["access_key_id"],
            secretAccessKey: env["objectstore"][0]["credentials"]["secret_access_key"],
            bucket: env["objectstore"][0]["credentials"]["bucket"]
        }

    }
    // else if (process.env.ENVIRONMENT == "Local") { //// If the Configuration Microservice is running in Local

    //     // Return Local folder Details 
    //     return {
    //         destinationFolderPath: path.join(__dirname, '../../ObjectStore')
    //     }
    // } 
    else if (process.env.ENVIRONMENT == "IBMCLOUD" || process.env.ENVIRONMENT == "Local") { //// If the Configuration Microservice is running in IBM Cloud

        // Return Object Store Details from VCAP_Services 
        return {
            endpoint: process.env.ENDPOINT,
            apiKeyId: process.env.APIKEYID,
            serviceInstanceId: process.env.SERVICEINSTANCEID
        }
    }

}


module.exports = { getObjectStoreConfiguration }