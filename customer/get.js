const response = require('../src/response')
const db = require('../src/db')
const dbClient = db.dbClient('us-east-1')

module.exports.index = async event => {
    this.id = `inst-${event.pathParameters.id}`
    this.custId = `cust-${event.pathParameters.cid}`
    this.params = {
        "TableName": "Entity-dev",
        "ScanIndexForward": true,
        "ConsistentRead": false,
        "KeyConditionExpression": "#69240 = :69240 and #69241 = :69241",
        "ExpressionAttributeValues": {
            ":69240": this.cid,
            ":69241": this.id
        },
        "ExpressionAttributeNames": {
            "#69240": "pk",
            "#69241": "sk"
        }
    }
    
    try {
        this.meter = await dbClient.query(this.params).promise()
        return response.success(this.meter.Items)
    } catch(error) {
        return response.failure(error)
    }
}