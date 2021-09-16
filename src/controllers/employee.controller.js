const creatError = require("http-errors");
const { Employee } = require("../models/employee.model");
const { Supervisors } = require("../models/supervisors.model");

exports.create = async (req, res) => {
    const {
        emp_id,
        f_name,
        l_name,
        email,
        password,
        phone,
        status,
        role,
        doj,
        dob,
        dpt,
        desig
    } = req.body;
    console.log(req.body);
    try {
        const user = await Employee.create({
            emp_id,
            f_name,
            l_name,
            email,
            password,
            phone,
            status,
            role,
            doj,
            dob,
            dpt,
            desig
        });
        console.log(user);
        if (!user) {
            return res.status(404).json(creatError.BadRequest());
        }
        res.json({ data: user.toJSON() });
    } catch (error) {
        console.log(error);
        res.json(creatError.BadRequest());
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const user = await Employee.findAll({
            include: [
                {
                    model: Employee,
                    as: "supervisor",
                    required: false,
                },
            ],
        });
        if (!user) {
            return res.status(404).json(creatError.BadRequest());
        }
        res.json({ data:user });
    } catch (error) {
        console.log(error);
        res.status(500).json(creatError.InternalServerError());
    }
};

exports.getEmployeeList = async (req, res) => {
    try {
        const user = await Employee.findAndCountAll({
        });
        if (!user) {
            return res.status(404).json(creatError.BadRequest());
        }
        res.json({ data:user });
    } catch (error) {
        console.log(error);
        res.status(500).json(creatError.InternalServerError());
    }
};

exports.updateEmployee = async (req, res) => {
    const id = req.params.userId;
    
    const {
        emp_id,
        f_name,
        l_name,
        email,
        password,
        phone,
        status,
        role,
        doe,
        dob,
        dpt,
        desig
    } = req.body;
    const data={ emp_id,
        f_name,
        l_name,
        email,
        phone,
        status,
        role,
        doe,
        dob,
        dpt,
        desig
    };
    if(password){
        data.password=password;
    }

    try {
        const user = await Employee.findOne({ where: { id } });
        if (!user) {
            return res.json("Employee not found");
        }
        await user.update(data)
      
        if (!sql) {
            return res.json(creatError.BadRequest());
        }
        res.status(200);
    } catch (error) {
        console.log(error);
        res.json(creatError.BadRequest());
    }
};

exports.getUserById = async (req, res) => {
    const id = req.params.userId;
    try {
        const employee = await Employee.findOne({ where: { id },attributes:{exclude:["password"]}});
        console.log(employee)
        if (!employee) {
            return res.status(404).json(creatError.BadRequest());
        }
        res.json({ data: employee.toJSON()});
    } catch (error) {
        console.log(error);
        res.json(creatError.InternalServerError());
    }
};

exports.deleteEmployee = async (req, res) => {
    const id = req.params.emp_id;
    try {
        const emp = await Employee.findOne({ where: { id } });
        if (!emp) {
            return res.status(404).json(creatError.BadRequest());
        }
        const user = await emp.destroy();
        res.json(user);
    } catch (error) {
        console.log(error);
        res.json(creatError.InternalServerError());
    }
};