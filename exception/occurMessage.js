/** RESPONE FORMAT */

const occurMessage = {};

occurMessage.occurError = (res, code, message) => {
    res.status(code).json({
        "data": "Error",
        "message": message
    })
}

occurMessage.occurSuccess = (res, code, message) => {
    res.status(code).json({
        "data": "Success",
        "message": message
    })
}

module.exports = occurMessage;