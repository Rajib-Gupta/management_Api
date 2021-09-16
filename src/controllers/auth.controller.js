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
            res.json(createError.BadRequest());
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
        console.log(error.message);
        res.json(createError.BadRequest("Invalid user!"));
    }
};


