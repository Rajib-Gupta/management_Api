const creatError = require("http-errors")
const { Supervisors } = require("../models/supervisors.model")
const { Employee } = require("../models/employee.model");
const { sequelize } = require("../database/client");


// exports.addSupervisor = async (req, res) => {
//   const employeeId = req.params?.empId
//   const { supervisor_id } = req.body
//   try {
//       const asign = await Supervisors.create({ supervisor_id, employeeId })
//       if (!asign) {
//           return res.json(creatError.BadRequest())
//       }
//       res.json({ data: asign.toJSON() })
//   } catch (error) {
//       console.log(error)
//       res.json(creatError.InternalServerError())
//   }
// }
exports.addSupervisor = async (req, res) => {
    const emp_id = req.params?.empId;
    const { supervisor_id } = req.body;
    const t = await sequelize.transaction();
    console.log({ emp_id, supervisor_id });
    try {
        const employee = await Employee.findByPk(emp_id);
        await employee.update({ supervisor_id: supervisor_id }, { transaction: t });

        const supervisor = await Employee.findByPk(supervisor_id);
        await supervisor.update({ role: "2" }, { transaction: t })

        await t.commit();
        res.json({ data: "Dhur" });
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.json(creatError.InternalServerError());
    }
};

exports.updateSuper = async (req, res) => {
    const id = req.params?.Id
    const { supervisor_id, emp_id } = req.body
    try {
        const emp = await Supervisors.findOne({ where: { id } })
        if (!emp) {
            return res.json("Employee not found")
        }
        const update = await emp.update({ supervisor_id })
        if (!update) {
            return res.json(creatError.BadRequest())
        }
        res.status(200).json({ data: update })

    } catch (error) {
        console.log(error.message)
        res.json(creatError.InternalServerError())
    }
}


exports.getEmpUnderSup = async (req, res) => {
    try {
        const sup = await Supervisors.findOne({
            where: { supervisor_id: req.params.supId }, include: {
                model: Employee,
            }
        }

        )
        if (!sup) {
            return res.json(creatError.InternalServerError())
        }
        res.json({ data: sup })
    } catch (error) {
        console.log(error.message)
        res.json(creatError.InternalServerError())
    }
}