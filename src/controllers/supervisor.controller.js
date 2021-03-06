const creatError = require("http-errors")
const { Supervisors } = require("../models/supervisors.model")
const { Employee } = require("../models/employee.model");
const { sequelize } = require("../database/client");
const { EmployeeKpi } = require("../models/employee_kpi.model");
const { Op } = require("sequelize");
const { Kpi_session } = require("../models/kpi-session.model");
const { Session } = require("../models/session.model")

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
        console.log("req.params.supId", req.params.supId);
        // const sup = await EmployeeKpi.findAndCountAll({
        //     // where: { supervisor_id: req.params.supId },
        //     // group: ["emp_id"],
        //     right: true,
        //     include: [/*{
        //         model: Kpi_session,
        //         where: { is_active: 1 },

        //     },*/
        //         {
        //             model: Employee,
        //             // where: {
        //                 // supervisor_id: req.params.supId
        //             // }
        //         }]
        // })

        const sup = await Employee.findAndCountAll({
            where: {
                supervisor_id: req.params.supId,
                id: {
                    [Op.ne]: req.params.supId,
                },
            },
            include: {
                required: false,
                model: EmployeeKpi,
                where: {
                    [Op.and]: [
                        { givenby_id: req.params.supId },
                        {
                            emp_id: {
                                [Op.ne]: req.params.supId
                            },
                        },
                    ],
                },
                include: {
                    model: Kpi_session,
                    where: { is_active: 1 },
                },
            },
            group: ["employee.id", "employee_kpi.id"],
            attributes: { include: ["password"] },
        });

        if (!sup) {
            return res.json(creatError.InternalServerError());
        }
        res.json({ data: sup });
    } catch (error) {
        console.log(error.message);
        res.json(creatError.InternalServerError());
    }
};