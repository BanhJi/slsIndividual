const response = require('../src/response')
const db = require('../src/db')
const { v1: uuid } = require('uuid');
const dbClient = db.dbClient('us-east-1')

function _randomize(max, min) {
    this.max = Math.floor(max)
    this.min = Math.ceil(min)
    return Math.floor(Math.random() * (max - min)) + min
}

function getDigits(num) {
    let digits = "";
    for (let i = num; i > 0; i--) {
        digits += _randomize(9, 0)
    }
    return digits
}

module.exports.index = async event => {
    if (event.headers["Content-Type"] !== "application/json") {
        return response.failure({"msg": "Expecting json but received " + event.headers["Content-Type"]})
    }
    try {
        JSON.parse(event.body)
    } catch (err) {
        return response.failure({msg: "Invalid json format"})
    }
    this.instId = event.pathParameters.id
    this.uuid = uuid()
    this.blk = getDigits(2)
    this.createdAt = new Date().toISOString()
    this.data = JSON.parse(event.body)
    this.table = "Entity-dev"
    this.meter = {
        "pk": `meter-${this.uuid}`,
        "sk": "inst-" + this.instId,
        "data": `inst-${this.instId}#meter-${this.uuid}#${this.data.customer.id}`,
        "block": this.data.customer.block,
        "readingAt": this.data.readingAt,
        "number": this.data.number,
        "status": "pending",
        "connectedAt": this.createdAt,
        "createdAt": this.createdAt,
        "updatedAt": this.createdAt
    }
    this.customer = {
        "pk": "meter-" + this.uuid,
        "sk": this.data.customer.id,
        "data": `inst-${this.instId}#${this.data.customer.id}#meter-${this.uuid}`,
        "block": this.data.customer.block,
        "firstName": this.data.customer.firstName,
        "lastName": this.data.customer.lastName,
        "status": "using",
        "connectedAt": this.createdAt,
        "createdAt": this.createdAt,
        "updatedAt": this.createdAt
    }
    this.params = {
        RequestItems: {
            [this.table]: [
                {
                    PutRequest: {
                        Item: this.meter
                    }
                },
                {
                    PutRequest: {
                        Item: this.customer
                    }
                }
            ]
        }
    }
    try {
        const result = await dbClient.batchWrite(this.params).promise()
        if (Object.keys(result.UnprocessedItems).length === 0) {
            return response.success(this.meter)
        }
        return result.failure(result.UnprocessedItems)
    } catch (err) {
        return response.failure({ data: err })
    }
}
