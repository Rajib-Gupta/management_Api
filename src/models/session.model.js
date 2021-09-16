const Sequelize = require("sequelize")
const { sequelize } = require("../database/client")


exports.Session=sequelize.define(
    "session",
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        session:{
            allowNull: false,
            type: Sequelize.ENUM,
            values:['1','2','3']
        }
    }
  );