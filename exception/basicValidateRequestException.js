//** EXCEPTION HANDLER  */

function basicValidateRequestBody(body) {
    for (const bodyValue in body) {
        if (basicValidateBodyValue(bodyValue, body) === false) {
            return false;
        }
    }
    return true;
}

function basicValidateBodyValue(bodyValue, body) {
    if (body[bodyValue] === undefined || body[bodyValue].trim() === "") {
        return false;
    }
    return true;
}

module.exports = basicValidateRequestBody;