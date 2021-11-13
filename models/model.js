const Sequelize = require('sequelize');

const getModel = (sequelize, tablename, tabledefinition) => {
    
    var sequelizeObj = {}
    var columns = Object.keys(tabledefinition)
    
    for (var i = 0; i < columns.length; i++) {
        let columnType = tabledefinition[columns[i]].type
        
        sequelizeObj[columns[i]] = {
            "type": Sequelize[columnType]
        }
    }

    var Table1 = sequelize.define(tablename,
        sequelizeObj, {
        freezeTableName: true
    });

    return Table1;
}

module.exports = { getModel }