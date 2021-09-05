require("dotenv").config()

const express = require("express")
const app = express()
const morgan = require("morgan")
const config = require("./config")
const { sequelize } = require("./database/client")

const { Employee } = require("./models/employee.model")
const { routes } = require("./routes/api")
const {Supervisors}=require("./models/supervisors.model")
const {Session}=require("./models/session.model")
const {Kpi_session}=require("./models/kpi-session.model")
const {EmployeeKpi}=require("./models/employee_kpi.model")

app.use(express.json());
app.use(morgan("dev"));
app.use(routes);


sequelize
  .sync({
    alter: true,
  })
  .then(() => {
    console.log("Database connected");

    app.listen(config.app.PORT, () => {
      console.log("Server running on " + config.app.PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });



