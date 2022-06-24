const {Pool} = require('pg')
const pool = new Pool()
module.exports = {
    query: (text, params) => pool.query(text, params),
    init: () => {
        if (this.query("SELECT count(t) FROM pg_catalog.pg_tables t WHERE t.tablename = 'reports';").rows[0].count === 0) {

        }
    }
}