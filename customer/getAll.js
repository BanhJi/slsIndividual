const response = require('../src/response')
const db = require('../src/db')
const dbClient = db.dbClient('us-east-1')
module.exports.index = async event => {
    this.id = event.pathParameters.id
    this.params = {
        "TableName": "Entity-dev",
        "IndexName": "inst-cust-index",
        "ScanIndexForward": true,
        "ConsistentRead": false,
        "KeyConditionExpression": "#69240 = :69240 and begins_with(#69241, :69241)",
        "ExpressionAttributeValues": {
            ":69240": `inst-${this.id}`,
            ":69241": "cust-"
        },
        "ExpressionAttributeNames": {
        "#69241": "pk",
        "#69240": "sk"
        }
    }
    
    try {
        this.meter = await dbClient.query(this.params).promise()
        this.meter = this.meter.Items.map(meter => {
            return Object.assign({}, {
                id: meter.pk,
                number: meter.number,
                firstName: meter.firstName,
                lastName: meter.lastName,
                block: meter.block
            })
        })
        return response.success(this.meter)
    } catch(error) {
        return response.failure(error)
    }
}