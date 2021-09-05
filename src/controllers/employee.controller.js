const creatError = require("http-errors")
const { restart } = require("nodemon")
const { Employee } = require("../models/employee.model")

exports.create = async (req, res) => {
    const { emp_id, f_name, l_name, email, password, phone, status, role, doe, dob, dpt } = req.body
    console.log(req.body)
    try {
        const user = await Employee.create({ emp_id, f_name, l_name, email, password, phone, status, role, doe, dob, dpt })
        console.log(user)
        if (!user) {
            return res.status(404).json(creatError.BadRequest())
        }
        res.json({ data: user.toJSON() })

    } catch (error) {
        console.log(error)
        res.json(creatError.BadRequest())
    }
}

exports.getEmployees=async(req,res)=>{
    try {
        const user=await Employee.findAndCountAll({})
        console.log(user)
        if(!user){
            return res.status(404).json(creatError.BadRequest())
        }
        res.json({data:user.rows})
        
    } catch (error) {
        console.log(error)
        res.status(500).json(creatError.InternalServerError())
        
    }
}

exports.updateEmployee=async(req,res)=>{
    const id=req.params.userId
    const {emp_id, f_name, l_name, email, password, phone, status, role, doe, dob, dpt}=req.body
    try {
        const user=await Employee.findOne({where:{id}})
        if(!user){
            return res.json("Employee not found")
        }
        const sql=await user.update({emp_id, f_name, l_name, email, password, phone, status, role, doe, dob, dpt})
        if(!sql){
            return res.json(creatError.BadRequest())
        }
        res.status(200).json({data:sql})
    } catch (error) {
        console.log(error)
        res.json(creatError.BadRequest())
        
    }
}

exports.getUserById=async(req,res)=>{
    const id=req.params.userId
    try {
        const employee=await Employee.findOne({where:{id}})
        if(!employee){
            return res.status(404).json(create.BadRequest())
        }
        res.json({data:employee})
    } catch (error) {
        console.log(error)
        res.json(creatError.InternalServerError())
        
    }
}

exports.deleteEmployee=async(req,res)=>{
    const id=req.params.empId
    try {
        const emp=await Employee.findOne({where:{id}})
        if(!emp){
            return res.status(404).json(creatError.BadRequest())
        }
        const user=await emp.destroy();
        res.json(user)
    } catch (error) {
        console.log(error)
        res.json(creatError.InternalServerError())
        
    }
}