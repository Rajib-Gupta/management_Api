const creatError = require("http-errors");
const { Employee } = require("../models/employee.model");
const { EmployeeKpi } = require("../models/employee_kpi.model");
const { Kpi_session } = require("../models/kpi-session.model");
const { Session } = require("../models/session.model");
const { sequelize } = require("../database/client");
const Sequelize = require("sequelize");

exports.kpiSession = async (req, res) => {
    const session_id = req.params?.ssId
    const { year, is_active, is_completed } = req.body
    try {
        const kpi = await Kpi_session.create({ year, is_active, is_completed, session_id })
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

exports.addSession = async (req, res) => {
    const { session } = req.body
    const { year, is_active, is_completed } = req.body
    const t = await sequelize.transaction();
    try {
        const runningSession = await Kpi_session.findOne({ where: { is_active: 1 } })
        console.log(runningSession)
        if (runningSession) {
            return res.status(400).json({ message: "Another session already running, Please close the Session to add a new Session!", success: false })
        }
        const part = await Session.create({ session }, { transaction: t })

        const store = part.toJSON()
        console.log("=============", store)
        const kpi = await Kpi_session.create({ year, is_active, is_completed, sessionId: store.id }, { transaction: t })
        await t.commit()
        res.status(200).json({ success: true, data: kpi, message: "Created Successfully" })

    } catch (error) {
        await t.rollback()
        console.log(error)
        res.status(500).json({ success: false, server: creatError.InternalServerError(), message: error.message })
    }
}

exports.kpiDetails = async (req, res) => {
    const emp_id = req.params?.empId
    const { supervisor_id, givenby_id, kpiSessionId, kpi_details } = req.body

    const payload = { supervisor_id: null, givenby_id, kpiSessionId, kpi_details, emp_id }
    if (supervisor_id) {
        payload.supervisor_id = supervisor_id
    }
    try {
        const details = await EmployeeKpi.create(payload)
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

exports.kpiActiveSession = async (req, res) => {
    const sessionId = req.params.session_id

    const t = await sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE });
    try {
        const sql = await Kpi_session.findAndCountAll({
            lock: true,
            include: [{
                model: Session,
                attributes: ['session'],

            }]
        },
            { transaction: t }
        )
        await t.commit()
        res.status(200).json({ success: true, data: sql, message: "Successfully Fetched!" })

    } catch (error) {
        await t.rollback()
        res.status(500).json({ success: false, server: creatError.InternalServerError(), message: error.message })

    }

}

exports.getKpiSuper = async (req, res) => {
    const sessionId = req.params.session_id
    const t = await sequelize.transaction();
    try {
        const sql = await Kpi_session.findAndCountAll({
            where: {
                is_completed: 0,
                is_active: 1
            },

            include: [{
                model: Session,
                attributes: ['session'],

            }, {
                model: EmployeeKpi
            }]

        }
            ,
            { transaction: t }
        )
        await t.commit()
        res.status(200).json({ success: true, data: sql, message: "Successfully Fetched!" })

    } catch (error) {
        await t.rollback()
        console.log(error)
        res.status(500).json({ success: false, server: creatError.InternalServerError(), message: error.message })

    }

}
exports.updateKpiDetails = async (req, res) => {
    const id = req.params.id
    const is_completed = req.body.is_completed
    const t = await sequelize.transaction();

    try {
        const sql = await Kpi_session.findOne({ where: { id } }, { transaction: t })

        const kpi = await sql.update({ is_completed, is_active: is_completed === 0 ? 1 : 0 })
        await t.commit()
        res.status(200).json({ success: true, data: kpi, message: "Updated Seccessfully!!" })
    } catch (error) {
        await t.rollback()
        res.status(500).json({ success: false, server: creatError.InternalServerError(), message: error.message })
    }
}


exports.getSessionAndKpidetails = async (req, res) => {

    const { year, session } = req.params
    try {
        const [data, metadata] = await sequelize.query(`SELECT
        kpi_ses.year,
        sess.session,
        kpi.id,
        kpi.emp_id,
        kpi.givenby_id,
        kpi.supervisor_id,
        CONCAT(emp.f_name, ' ', emp.l_name) AS 'to_emp',
        CONCAT(sup.f_name, ' ', sup.l_name) AS 'from_emp',
        AVG(
            JSON_VALUE(
                kpi.kpi_details,
                '$.availability'
            ) + JSON_VALUE(kpi.kpi_details, '$.ontime') + JSON_VALUE(kpi.kpi_details, '$.punctuality') + JSON_VALUE(kpi.kpi_details, '$.regularity') + JSON_VALUE(
                kpi.kpi_details,
                '$.timetorepair'
            ) + JSON_VALUE(
                kpi.kpi_details,
                '$.criticalproblemsolving'
            ) + JSON_VALUE(
                kpi.kpi_details,
                '$.clienthandling'
            ) + JSON_VALUE(kpi.kpi_details, '$.innovative') + JSON_VALUE(kpi.kpi_details, '$.teamPlayer') + JSON_VALUE(
                kpi.kpi_details,
                '$.dependibility'
            )
        ) AS 'total_avg',
        AVG(
            JSON_VALUE(
                emp_kpi.kpi_details,
                '$.availability'
            ) + JSON_VALUE(emp_kpi.kpi_details, '$.ontime') + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.punctuality'
            ) + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.regularity'
            ) + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.timetorepair'
            ) + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.criticalproblemsolving'
            ) + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.clienthandling'
            ) + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.innovative'
            ) + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.teamPlayer'
            ) + JSON_VALUE(
                emp_kpi.kpi_details,
                '$.dependibility'
            )
        ) AS 'emp_avg',
        AVG(
            JSON_VALUE(
                sup_kpi.kpi_details,
                '$.availability'
            ) + JSON_VALUE(sup_kpi.kpi_details, '$.ontime') + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.punctuality'
            ) + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.regularity'
            ) + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.timetorepair'
            ) + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.criticalproblemsolving'
            ) + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.clienthandling'
            ) + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.innovative'
            ) + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.teamPlayer'
            ) + JSON_VALUE(
                sup_kpi.kpi_details,
                '$.dependibility'
            )
        ) AS 'sup_avg'
    FROM
        management.kpi_sessions AS kpi_ses
    INNER JOIN management.sessions AS sess
    ON
        sess.id = kpi_ses.sessionId AND sess.session = ${session}
    INNER JOIN management.employee_kpis AS kpi
    ON
        kpi.kpiSessionId = kpi_ses.id
    INNER JOIN employees AS emp
    ON
        emp.id = kpi.emp_id
    LEFT JOIN employees AS sup
    ON
        sup.id = kpi.givenby_id
    LEFT JOIN management.employee_kpis AS emp_kpi
    ON
        (
            emp_kpi.givenby_id = emp_kpi.emp_id
        ) AND(
            emp_kpi.givenby_id = kpi.givenby_id
        ) AND(kpi.emp_id = kpi.givenby_id)
    LEFT JOIN management.employee_kpis AS sup_kpi
    ON
        (
            sup_kpi.givenby_id != sup_kpi.emp_id
        ) AND(
            sup_kpi.givenby_id = kpi.givenby_id
        ) AND(kpi.emp_id != kpi.givenby_id)
    WHERE
        kpi_ses.year =${year}
    GROUP BY
        kpi.id`)


        // data.forEach(d => {
        //     if (d.sup_kpi_details) {
        //        // d.sup_kpi_details = JSON.parse(d.sup_kpi_details)
        //         console.log("=========",d.sup_kpi_details)

        //     }

        //     if (d.emp_kpi_details) {
        //        // d.emp_kpi_details = JSON.parse(d.emp_kpi_details)
        //         console.log("=========", d.emp_kpi_details)
        //     }
        // })
        // console.log("=========", data)


        res.status(200).json({ success: true, data, message: "Data fetched Successfully" })

    } catch (error) {
        console.log(error)

        res.status(500).json({ success: false, error, message: creatError.InternalServerError() })
    }
}

exports.kpideleteSession = async (req, res) => {
    const id = req.params.emp_id
    try {
        const kpi = await Kpi_session.findOne({ where: { id } })
        if (!kpi) {
            return res.status(404).json(creatError.BadRequest());
        }
        const session = await kpi.destroy();
        res.status(200).json({ success: true, session, message: "Data fetched Successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error, message: creatError.InternalServerError() })

    }
}

/***
 *  get kpi details by id
 * 
 *  */

exports.getKpiById = async (req, res) => {

    const id = req.params.id
    try {
        const data = await EmployeeKpi.findOne({ where: { id } })
        if (!data) {
            return res.status(404).json({ success: false, message: "Employee not Found!" })
        }

        //data.kpi_details = JSON.parse(data.kpi_details)
        res.status(200).json({ success: true, data, message: "Successfully Fetched!" })
    } catch (error) {

        res.status(500).json({ success: false, error, message: creatError.InternalServerError() })
    }
}

/***
 * See kpi details of employee own and employee under
 */

// exports.kpiDetailsEmployeeOwn = async (req, res) => {
//     const { emp_id, givenby_id } = req.params

//     try {
//         const kpiData = await EmployeeKpi.findOne({
//             where: { emp_id, givenby_id }, include: [{
//                 model: Kpi_session,
//                 //where: { is_active: 1 },
//                 include: [{
//                     model: Session,

//                 }]
//             }], group: ["givenby_id"]
//         })
//         if (!kpiData) {
//             return res.status(404).json({ success: false, message: "Employee not Found!" })
//         }
//        // kpiData.kpi_details = JSON.parse(kpiData.kpi_details)
//         res.status(200).json({ success: true, kpiData, message: "Successfully Fetched!" })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, error, message: creatError.InternalServerError() })
//     }
// }
exports.kpiDetailsEmployeeOwn = async (req, res) => {
    const { emp_id, givenby_id } = req.params

    try {
        const [kpiData, metadata] = await sequelize.query(`SELECT kpi.id,kpi.emp_id,kpi.supervisor_id,kpi.givenby_id,kpi.kpi_details,kpi.createdAt,kpi.updatedAt,kpi.kpiSessionId,kpi_ses.id,kpi_ses.year,kpi_ses.is_active,kpi_ses.is_completed,kpi_ses.createdAt,kpi_ses.updatedAt,sess.*,kpi_ses.sessionId FROM employee_kpis AS kpi INNER JOIN kpi_sessions AS kpi_ses ON kpi.kpiSessionId = kpi_ses.id INNER JOIN sessions AS sess ON sess.id = kpi_ses.sessionId WHERE kpi.emp_id ="${emp_id}" AND kpi.givenby_id = "${givenby_id}" GROUP by sess.id, kpi_ses.id, kpi.id`)
        if (!kpiData) {
            return res.status(404).json({ success: false, message: "Employee not Found!" })
        }
        // kpiData.kpi_details = JSON.parse(kpiData.kpi_details)
        res.status(200).json({ success: true, kpiData, message: "Successfully Fetched!" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error, message: creatError.InternalServerError() })
    }
}