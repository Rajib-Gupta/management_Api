require("dotenv").config();

const express = require("express");

const morgan = require("morgan");
const config = require("./config");
const { sequelize } = require("./database/client");

const { Employee } = require("./models/employee.model");
const { routes } = require("./routes/api");
const { Supervisors } = require("./models/supervisors.model");
const { Session } = require("./models/session.model");
const { Kpi_session } = require("./models/kpi-session.model");
const { EmployeeKpi } = require("./models/employee_kpi.model");
const { kpiDetails } = require("./controllers/kpi.controller");
const path = require("path");
const cors = require("cors");

Employee.belongsTo(Employee, {
  as: "supervisor",
  foreignKey: "supervisor_id",
  onDelete: "cascade",
});

// Employee.hasMany(Supervisors)
// Supervisors.belongsTo(Employee)

Session.hasMany(Kpi_session)
Kpi_session.belongsTo(Session)

Kpi_session.hasMany(EmployeeKpi)
EmployeeKpi.belongsTo(Kpi_session)

Employee.hasOne(EmployeeKpi, { foreignKey: "emp_id"})
EmployeeKpi.belongsTo(Employee, { foreignKey: "emp_id" })

sequelize
  .sync({
    alter: false,
  })
  .then(() => {
    console.log("Database connected");
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.static(path.join(__dirname, "../", "uploads")))
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("dev"));
    app.use(routes);

    app.listen(config.app.PORT, () => {
      console.log("Server running on " + config.app.PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });