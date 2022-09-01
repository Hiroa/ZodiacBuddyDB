const CronJob = require('cron').CronJob
const db = require('./db')

function getTwoMonthAgo() {
    const date = new Date()
    date.setMonth(date.getMonth() - 2)
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}

module.exports = {
    init: () => {
        new CronJob(
            '0 5 0 1 * *',
            function() {
                const date = getTwoMonthAgo()
                console.log(`Monthly bdd clean up - clean all before ${date}`)
                db.query(
                    'DELETE FROM reports r WHERE r.date < $1',
                    [date]
                )
            },
            null,
            true
        )
    }
}