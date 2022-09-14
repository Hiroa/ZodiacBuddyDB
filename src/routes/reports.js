const Router = require('express-promise-router')
const db = require('../db')
const Report = require('../object/report')
const Security = require('../security/security')

const router = new Router()

module.exports = router

router.get('/active', async (req, res) => {

    const activeBonus = (await getActiveBonus()).rows

    let result = [];
    let territory = [];
    activeBonus.forEach((r) => {
        if (!territory.includes(r.territory_id)) {
            territory.push(r.territory_id)
            result.push(r)
        }
    })

    res.json(result)
})

router.post('/', Security.checkJWT, async (req, res) => {
    let report = Report.from(req.body)
    const ip = req.header('Fly-Client-IP')

    if (!report.validate(ip))
        return res.sendStatus(400)

    //Check if not present in the active and previous window
    const count = (await isAlreadyRegistered(report.territory_id)).rows
    if (count[0].count >= 1) {
        return res.sendStatus(204)
    }

    console.log(`[${req.aud}:${req.cid}] New report: ${JSON.stringify(report)}`)
    insertReport(report)
    res.sendStatus(204)
})

function insertReport(report) {
    db.query('INSERT INTO reports (datacenter_id, world_id, territory_id, date) VALUES ($1, $2, $3, $4)',
        [report.datacenter_id, report.world_id, report.territory_id, report.date])
}

async function isAlreadyRegistered(territory_id) {
    return await db.query(
        'SELECT DISTINCT count(r.territory_id) FROM reports r WHERE r.date > $1 AND r.territory_id = $2',
        [getPreviousResetDate(), territory_id]
    )
}

async function getActiveBonus() {
    return await db.query(
        'SELECT r.datacenter_id, r.world_id, r.territory_id, r.date FROM reports r WHERE r.date > $1 ORDER BY r.date DESC',
        [getActiveResetDate()]
    )
}

function getPreviousResetDate() {
    let date = new Date()
    let previousEvenHour = date.getHours() % 2 === 0 ?
        date.getHours() - 2:
        date.getHours() - 3
    date.setHours(previousEvenHour)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}

function getActiveResetDate() {
    let date = new Date()
    let activeEvenHour = date.getHours() % 2 === 0 ?
        date.getHours() :
        date.getHours() - 1
    date.setHours(activeEvenHour)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}