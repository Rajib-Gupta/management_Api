const Sequelize = require("sequelize")
const { sequelize } = require("../database/client")

exports.Kpi_session=sequelize.define(
    "kpi_session",{
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        session_id:{
            allowNull: false,
            type: Sequelize.ENUM,
            values:['1','2','3']
        },
        year:{
            allowNull:false,
            type:Sequelize.INTEGER
        },
        is_active:{
            allowNull:false,
            type:Sequelize.INTEGER
        },
        is_completed:{
            allowNull:false,
            type:Sequelize.INTEGER
        }
    }
);