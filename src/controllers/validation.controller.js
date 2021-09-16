const creatError = require("http-errors");
const { Employee } = require("../models/employee.model");

exports.emailValidation=async(req,res)=>{
    const {email}=req.body;
    try {
        const user=await Employee.count({where:{email}})

        res.json({data:user})
        
    } catch (error) {
        console.log(error)
        res.json(creatError.BadRequest())
    }
}