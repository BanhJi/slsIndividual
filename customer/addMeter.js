const response = require('../src/response')
const db = require('../src/db')
const { v1: uuid } = require('uuid');
// const dbClient = db.dbClient('us-east-1')
const dbClient = db.localhost();

module.exports.index = async (event) => {
    if (event.headers["Content-Type"] !== "application/json") {
        return response.failure({"msg": "Expecting json but received " + event.headers["Content-Type"]})
    }
    try {
        JSON.parse(event.body)
    } catch (err) {
        return response.failure({msg: "Invalid json format"})
    }

    this.instId = event.pathParameters.id
    this.cid = event.pathParameters.cid
    this.mid =  event.pathParameters.mid
    this.data = JSON.parse(event.body)
    this.uuid = uuid()
    this.createdAt = new Date().toISOString()
    this.table = "Entity"
    this.meter = {
        pk: `meter-${this.uuid}`,
        sk: this.data.customer.id,
        "gsi1-pk": `inst-${this.instId}`,
        "gsi1-sk": `meter-${this.uuid}`
    }
    this.params = {
        TableName: this.table,
        Item: this.meter
    }
    console.log(this.params)
    try {
        const result = await dbClient.put(this.params).promise()
        return response.success(this.meter)
    } catch(err) {
        return response.failure({ error: err })
    }
}