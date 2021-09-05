const Sequelize = require("sequelize")
const { sequelize } = require("../database/client")

exports.EmployeeKpi = sequelize.define(
    "employee_kpi",
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        emp_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        supervisor_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        kpi_session_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        feedback_emp_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },

        availability: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        ontime: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        punctuality: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        regularity: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        timetorepair: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        criticalproblemsolving: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        clienthandling: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        innovative: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        teamPlayer: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        dependibility: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },

    }
)