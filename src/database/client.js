const Sequelize = require("sequelize");
const config = require("../config")

exports.sequelize = new Sequelize(config.mysql.DB, config.mysql.USER, config.mysql.PASSWORD, {
    dialect: 'mysql',
    host: config.mysql.HOST,
    port: config.mysql.PORT,
    logging:false,
   //logging: (query) => console.log(query)
});


