import res from './src/response'
module.exports.index = async event => {
    return res(200, 'Update Data', 'Data found', event)
}