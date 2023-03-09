const jwt = require("jsonwebtoken")

module.exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.isAuth = false
        return next()
    }

    const token = authHeader.split(' ')[1]
    if (!toke || token == '') {
        req.isAuth = false
        return next()
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey')
    } catch (error) {
        req.isAuth = false
        return next()
    }

    if (!decodedToken) {
        req.isAuth = false
        return next()
    }

    req.isAuth = true
    req.userID = decodedToken.userID
    return next()
}