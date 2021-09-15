const response = require('../src/response')
const db = require('../src/db')
const dbClient = db.dbClient('us-east-1')
module.exports.index = async event => {
    this.id = event.pathParameters.id
    this.params = {
        "TableName": "Entity-dev",
        "IndexName": "GSI1",
        "ScanIndexForward": true,
        "ConsistentRead": false,
        "KeyConditionExpression": "#69240 = :69240 and begins_with(#69241, :69241)",
        "ExpressionAttributeValues": {
            ":69240": `inst-${this.id}`,
            ":69241": "meter-"
        },
        "ExpressionAttributeNames": {
        "#69241": "pk",
        "#69240": "sk"
        }
    }
    
    try {
        this.meter = await dbClient.query(this.params).promise()
        return response.success(this.meter.Items)
    } catch(error) {
        return response.failure(error)
    }
}