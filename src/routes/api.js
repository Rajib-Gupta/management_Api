const routes = require("express").Router()

const { create, getEmployees, updateEmployee, getUserById, deleteEmployee,getEmployeeKpiCurrentDetails, getEmployeeList } = require("../controllers/employee.controller")
const { uploads, imageUpload } = require("../controllers/image-upload.controller")
const { addSupervisor, updateSuper, getEmpUnderSup } = require("../controllers/supervisor.controller")
const { kpiSession, getSessionAndKpidetails,kpiDetailsEmployeeOwn,getKpiById,kpiDetailsForAdmin, session, getKpiSuper, addSession, kpiDetails, getKpiDetails, kpiActiveSession, updateKpiDetails, kpideleteSession } = require("../controllers/kpi.controller")
const { masterLogin, passwordRest } = require("../controllers/auth.controller")
const { emailValidation } = require("../controllers/validation.controller")

//Employee routes

routes.post('/create', create)   // create new employees
routes.get('/get-all', getEmployees) // get all employees
routes.put('/update/:userId', updateEmployee) // update employee by id
routes.get('/get-employee/:userId', getUserById) // get employee details by id
routes.post("/upload-image/:emp_id", uploads.single("file"), imageUpload);
routes.delete("/delete-emp/:emp_id", deleteEmployee)
routes.get("/total-employee", getEmployeeList)
// supervisors routes

routes.put('/add-super/:empId', addSupervisor)   // asign supervisor
routes.put('/update-super/:Id', updateSuper)   // update supervisor
routes.get('/emp-under-super/:supId', getEmpUnderSup)   // employee under supervisor

// kpi session routes
routes.post('/add-kpi-session/:ssId', kpiSession)// add kpi session
// ad kpi session with session id from session table
routes.post('/add-session', addSession)// add session
routes.post('/add-kpi/:empId', kpiDetails)// add kpi
routes.get('/get-kpi/:sessionId', getKpiDetails)// add kpi
routes.get('/kpi-details', kpiActiveSession)
routes.put('/update-kpi/:id', updateKpiDetails)
routes.get('/getkpi-super', getKpiSuper)
routes.get('/get-kpi-details-session/:year/:session', getSessionAndKpidetails)
routes.get('/get-kpi-details/:id', getKpiById)
routes.get('/get-kpi-data/:emp_id/:givenby_id', kpiDetailsEmployeeOwn)
routes.post('/get-details-submitKpi',getEmployeeKpiCurrentDetails)
routes.get('/get-kpidetails-foradmin/:emp_id/:givenby_id/:kpiSessionId',kpiDetailsForAdmin)

// sign in route
routes.post('/masterlogin', masterLogin)// add kpi
routes.post('/password-reset/:emp_id', passwordRest)// add kpi

routes.post("/upload-image/:emp_id", uploads.single("file"), imageUpload);
routes.delete("/delete-session/:emp_id", kpideleteSession);

// validation controller
routes.post('/emailValidation', emailValidation)

module.exports = { routes }