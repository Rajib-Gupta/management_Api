const routes = require("express").Router()

const { create,getEmployees,updateEmployee,getUserById } = require("../controllers/employee.controller")


//Employee routes

routes.post('/create', create)   // create new employees
routes.get('/get-all',getEmployees) // get all employees
routes.post('/update/:userId',updateEmployee) // update employee by id
routes.get('/get-employee/:userId',getUserById) // get employee details by id




module.exports={routes}