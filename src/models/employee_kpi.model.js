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
    //     kpi_session_id: {
    //         allowNull: false,
    //         type: Sequelize.UUID,
    //     },
        kpi_details:{
            allowNull:true,
            type:Sequelize.JSON()
        }

    }
)