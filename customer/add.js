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

const first = ['Jonh', 'Jane', 'Apple', 'Brown', 'Hanna', 'Chan', 'Brandon', 'Silver', 'Rose', 'Jasmin']
const last = ['English', 'Hien', 'Seed', 'Lincon', 'Spring', 'Summer', 'Winter', 'Fall', 'Albino', 'Chan']

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
    const params = {
        "TableName": "Entity-dev",
        "Item": {
            "pk": "cust-" + this.uuid,
            "sk": "inst-" + this.instId,
            "data": `meter#inst-${this.instId}blk-${this.blk}`,
            "block": this.blk,
            "number": getDigits(8),
            "firstName": first[_randomize(9,0)],
            "lastName": last[_randomize(9, 0)],
            "connectedAt": this.createdAt,
            "createdAt": this.createdAt,
            "updatedAt": this.createdAt
        }
    }
    try {
        await dbClient.put(params).promise()
        return response.success({ meter: params.Item })
    } catch (error) {
        return response.failure(error)
    }
}
