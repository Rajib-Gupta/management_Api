const creatError = require("http-errors");
const { Employee } = require("../models/employee.model");
const { EmployeeKpi } = require("../models/employee_kpi.model");
const { Kpi_session } = require("../models/kpi-session.model");
const { Session } = require("../models/session.model");


exports.kpiSession = async (req, res) => {
    const session_id = req.params?.ssId
    const { year, is_active, is_completed } = req.body
    try {
        const kpi = await Kpi_session.create({ year,is_active, is_completed, session_id })
        if (!kpi) {
            return res.json(creatError.BadRequest())
        }
        res.json({ data: kpi.toJSON() })

    } catch (error) {
        console.log(error)
        res.json(creatError.InternalServerError())
    }
}
exports.session = async (req, res) => {
    const { session } = req.body
    try {
        const emp = await Session.create({ session })
        if (!emp) {
            return res.json(creatError.BadRequest())
        }
        res.json(emp)
    } catch (error) {
        console.log(error)
        res.json(creatError.InternalServerError())
    }
}

exports.kpiDetails = async (req, res) => {
    const emp_id = req.params?.empId
    const { supervisor_id, kpiSessionId, kpi_details } = req.body
    try {
        const details = await EmployeeKpi.create({ emp_id, supervisor_id, kpiSessionId, kpi_details })
        if (!details) {
            return res.json(creatError.BadRequest())
        }
        res.json(details)
    } catch (error) {
        console.log(error)
        res.json(creatError.InternalServerError(error.message))
    }
}
exports.getKpiDetails = async (req, res) => {
    const kpiSessionId = req.params?.sessionId
    const year = req.query?.year
    try {
        const result = await EmployeeKpi.findAll({
            where: { kpiSessionId }, includes: [{
                model: Kpi_session,
                where: {
                    year
                }
            }
            ]
        }
        )
        if (!result) {
            return res.json(creatError.BadRequest())
        }
        res.json({ data: result })

    } catch (error) {
        console.log(error)
        res.json(creatError.InternalServerError())
    }
}
