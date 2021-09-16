const Sequelize = require("sequelize")
const { sequelize } = require("../database/client")

exports.Employee = sequelize.define(
    "employee",
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        emp_id: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        f_name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        l_name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        email: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        phone: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        dob: {
            allowNull: false,
            type: Sequelize.DATEONLY,
        },
        doj: {
            allowNull: false,
            type: Sequelize.DATEONLY,
        },
        dpt: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        role: {
            allowNull: false,
            type: Sequelize.ENUM,
            values: ['1', '2', '3', '4'],
        },
        status: {
            allowNull: false,
            type: Sequelize.ENUM,
            values: ['0', '1'],
        },
        image:{
            allowNull:true,
            type:Sequelize.STRING
        },
        desig:{
            allowNull: false,
            type: Sequelize.STRING,
        }
    

    }


);