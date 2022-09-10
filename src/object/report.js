module.exports = class Report {
    datacenter_id
    world_id
    territory_id
    date

    static from(obj) {
        return Object.assign(new Report(), obj);
    }

    validate(ip) {
        if (!this.datacenter_id || !Number(this.datacenter_id) || this.datacenter_id <= 0) {
            console.warn(`[${ip}] Bad datacenter_id -> ${this}`)
            return false;
        }

        if (!this.world_id || !Number(this.world_id) || this.world_id <= 0) {
            console.warn(`[${ip}] Bad world_id -> ${this}`)
            return false;
        }

        if (!this.territory_id || !Number(this.territory_id) || this.territory_id <= 0) {
            console.warn(`[${ip}] Bad territory_id -> ${this}`);
            return false;
        }

        if (!this.date || new Date(this.date).toString() === "Invalid date") {
            console.warn(`[${ip}] Bad date -> ${this}`)
            return false;
        }
        return true;
    }

    toString() {
        return JSON.stringify(this);
    }
}