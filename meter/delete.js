import res from './src/response'
module.exports.index = async event => {
    return res(200, 'Delete Data', 'Data found', event)
}