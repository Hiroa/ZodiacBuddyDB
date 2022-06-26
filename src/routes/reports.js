const Router = require('express-promise-router')
const db = require('../db')
const Report = require('../object/report')
const Security = require('../security/security')

const router = new Router()

module.exports = router

router.get('/last/:datacenter', async (req, res) => {
    const {datacenter} = req.params;

    if (!datacenter || Number(datacenter) <= 0) {
        console.warn("Bad datacenter -> " + datacenter)
        return res.sendStatus(400)
    }

    console.debug("Get last report for datacenter -> " + datacenter)
    const {rows} = await db.query(
        'SELECT r.datacenter_id, r.world_id, r.territory_id, r.date FROM reports r WHERE r.datacenter_id = $1 AND r.date > $2 ORDER BY r.date DESC LIMIT 1',
        [datacenter, getLastResetDate()]
    )

    if (rows.length > 0) {
        res.json(rows[0])
    } else {
        res.sendStatus(404)
    }
})

router.post('/', Security.checkJWT,async (req, res) => {
    let report = Report.from(req.body)

    if (!report.validate())
        return res.sendStatus(400)

    console.log(`[${req.aud}:${req.cid}] New report: ${JSON.stringify(report)}`)
    db.query(
        'INSERT INTO reports (datacenter_id, world_id, territory_id, date) VALUES ($1, $2, $3, $4)',
        [report.datacenter_id, report.world_id, report.territory_id, new Date(report.date)])
    res.sendStatus(204)
})

function getLastResetDate() {
    let date = new Date()
    console.log(date)
    let lastEvenHour = date.getHours()%2 === 0 ?
        date.getHours() - 2 :
        date.getHours() - 1
    date.setHours(lastEvenHour)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    console.log(date)
    return date
}