const routes = require("express").Router()

const { create,getEmployees,updateEmployee,getUserById,deleteEmployee,getEmployeeList } = require("../controllers/employee.controller")
const { uploads, imageUpload } = require("../controllers/image-upload.controller")
const {addSupervisor,updateSuper,getEmpUnderSup}=require("../controllers/supervisor.controller")
const{kpiSession,session,kpiDetails,getKpiDetails}=require("../controllers/kpi.controller")
const{masterLogin}=require("../controllers/auth.controller")
const{emailValidation}=require("../controllers/validation.controller")
//Employee routes

routes.post('/create', create)   // create new employees
routes.get('/get-all',getEmployees) // get all employees
routes.put('/update/:userId',updateEmployee) // update employee by id
routes.get('/get-employee/:userId',getUserById) // get employee details by id
routes.post("/upload-image/:emp_id", uploads.single("file"), imageUpload);
routes.delete("/delete-emp/:emp_id",deleteEmployee) 
routes.get("/total-employee",getEmployeeList) 
 // supervisors routes

 routes.put('/add-super/:empId', addSupervisor)   // asign supervisor
 routes.put('/update-super/:Id', updateSuper)   // update supervisor
 routes.get('/emp-under-super/:supId', getEmpUnderSup)   // employee under supervisor

 // kpi session routes
 routes.post('/add-kpi-session/:ssId', kpiSession)// add kpi session
 routes.post('/add-session', session)// add session
 routes.post('/add-kpi/:empId', kpiDetails)// add kpi
 routes.get('/get-kpi/:sessionId', getKpiDetails)// add kpi

 // sign in route
 routes.post('/masterlogin',masterLogin)// add kpi

// validation controller
routes.post('/emailValidation',emailValidation)

module.exports={routes}