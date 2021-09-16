const Sequelize = require("sequelize")
const { sequelize } = require("../database/client")

exports.Supervisors=sequelize.define(
    "supervisors",
    {
        id:{
            type:Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        supervisor_id:{
            allowNull:true,
            type:Sequelize.UUID,
        }
    }
);