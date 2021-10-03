const createError = require("http-errors");
const { Employee } = require("../models/employee.model");

var jwt = require("jsonwebtoken");

exports.masterLogin = async (req, res) => {
    var { email, password } = req.body;
    console.log("test", req.body);
    try {
        // const sql = `select * from employee_master where role="${role}" and email="${email}" and password="${password}"`;
        const employee = await Employee.findOne({ where: { email, password }, attributes: { exclude: ["password"] } })
        console.log("employee", employee);

        // var { password, ...master } = rows.length ? { ...rows[0] } : {};
        if (!employee) {
            res.status(404).json({success:false,message:"Please check login credentials!"});
        }
        else {
            let payload = { subject: email };
            let token = jwt.sign(payload, "secretKey");
            res.send({
                code: 200,
                success: "login sucessfull",
                token,
                data: employee,
            });
        }
    }
    catch (error) {
        //console.log(error.message);
        res.status(500).json({success:false,message:createError.InternalServerError()})
    }
};

exports.passwordRest = async (req, res) => {
    const id  = req.params.emp_id
    const { password, newPassword } = req.body
    try {
        const user = await Employee.findOne({ where: { id } })
        if (user.password === password) {
            const upgrade = await user.update({ password: newPassword })
            if (!upgrade) {
                throw new Error({ message: "Please check!" })
            }
            res.status(200).json({ success: true, upgrade, message: "Successfully updated!" })
        }
        else {
            return res.status(404).json({ success: false, message: "Please check your old password!" })
        }


        
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error, message: createError.InternalServerError() })
    }
}


