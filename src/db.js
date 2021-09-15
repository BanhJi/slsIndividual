const AWS = require('aws-sdk')
function dbInit(region = null) {
    this.region = 'ap-southeast-1'
    if (region !== null) {
        this.region = region
    }
    AWS.config.update({ region: this.region })
    return new AWS.DynamoDB.DocumentClient()
}

exports.dbClient = (regionName = null) => {
    return dbInit(regionName)
}