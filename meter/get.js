const response = require('../src/response')
const db = require('../src/db')
const dbClient = db.dbClient('us-east-1')

module.exports.index = async event => {
    this.id = event.pathParameters.id
    this.params = {
        "TableName": "Entity-dev",
        "ScanIndexForward": true,
        "ConsistentRead": false,
        "KeyConditionExpression": "#69240 = :69240",
        "ExpressionAttributeValues": {
            ":69240": this.id
        },
        "ExpressionAttributeNames": {
        "#69240": "pk"
        }
    }

    try {
        this.meter = await dbClient.query(this.params).promise()
        return response.success(this.meter.Items)
    } catch(error) {
        return response.failure(error)
    }
}