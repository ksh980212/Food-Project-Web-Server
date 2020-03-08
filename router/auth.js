//* module import*/
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//* exception handler import */
const basicValidateRequestBody = require('../exception/basicValidateRequestException');
const { occurError, occurSuccess } = require('../exception/occurMessage');

/** Sequelize Model import */
const User = require('../model/User');

/** TOKEN secret value */
const TOKEN_SECRET = process.env.TOKEN_SECRET;

/** express routing */
const router = express.Router();



/** 
 *  API URL /api/v1/auth/signup
 */

router.post("/signup", (req, res) => {

    /** Signup request body Exception Hanlder */
    if (basicValidateRequestBody(req.body) === false) {
        return occurError(res, 400, "Input Error");
    }

    /** Receive request.body  */
    const { user_id, name, email, _password } = req.body;

    /** Set Salting Value */
    const salt = Math.round(new Date().valueOf() * Math.random()) + "";

    /**Set Password Crypto */
    const hashPassword = crypto.createHash("sha512").update(_password + salt).digest("hex");

    User.findAll({
        where: { user_id: user_id }
    }).then(idExist => {

        /** ID Duplication Error Handler*/
        if (idExist.length !== 0) {
            return occurError(res, 400, "Already exist ID");
        }

        /** Signup Handler */
        User.create({
            user_id: user_id,
            name: name,
            email: email,
            password: hashPassword,
            salt: salt
        }).then(() => {

            //**SIGNUP SUCCESS */
            occurSuccess(res, 200, "Signup Success");

        }).catch(() => {
            return occurError(res, 500, "DB Error");
        })
    }).catch(() => {
        return occurError(res, 500, "DB Error");
    })
});




/**
 *  API URL /api/v1/auth/login
 */

router.post("/login", (req, res) => {

    /** Login request body Exception Hanlder */
    if (basicValidateRequestBody(req.body) === false) {
        return occurError(res, 400, "Input Error");
    }

    /** Receive request.body  */
    const { user_id, password } = req.body;

    /** Set Salting */
    let salt;

    User.findOne({
        attributes: ['salt'],
        where: {
            user_id: user_id
        }
    }).then(response => {

        /** */
        if (response === null) {
            return occurError(res, 400, "login Failed");
        }

        /**set salting from database */
        salt = response.dataValues.salt;

        //**crypto handler using salting */
        const hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

        /**Set JWT Token */
        const token = jwt.sign({ something: "something" }, TOKEN_SECRET, { expiresIn: "5m" })

        User.findOne({
            where: {
                user_id: user_id,
                password: hashPassword
            }
        }).then(response => {

            /**Id doesn't exists */
            if (response === null) {
                return occurError(res, 400, "login Failed");
            }

            /** LOGIN SUCCESS */
            res.status(200).json({
                "data": "OK",
                "message": "Login Success",
                "token": token,
                "user_id": user_id,
                "instagram": response.dataValues.instargramID
            })

        }).catch(() => {
            return occurError(res, 500, "DB Error");
        }).catch(() => {
            return occurError(res, 500, "DB Error");
        })
    })
})



// /**
//  *  GET /api/v1/auth/finduser
//  */

router.post("/finduser", (req, res) => {

    /** FindUser request body Exception Hanlder */
    if (basicValidateRequestBody(req.body) === false) {
        return occurError(res, 400, "finduser input Error");
    }

    /** Receive request.body  */
    const { name, email } = req.body;

    User.findOne({
        attributes: ['user_id'],
        where: {
            name: name,
            email: email
        }
    }).then(response => {

        /**Id doesn't exists */
        if (response === null) {
            return occurError(res, 400, "finduser id doesn't exists");
        }

        /** FindUser SUCCESS */
        res.status(200).send(response.dataValues.user_id);

    }).catch(() => {
        return occurError(res, 500, "DB Error");
    })
});



/**
 *  API URL /api/v1/auth/getUserInfo (계정 정보 불러오기)
 */

router.post("/getUserInfo", (req, res) => {

    /** GetUserInfo request body Exception Hanlder */
    if (basicValidateRequestBody(req.body) === false) {
        return occurError(res, 400, "ID Error");
    }

    /** Receive request.body  */
    const { user_id } = req.body;

    User.findOne({
        attributes: ['user_id', 'name', 'email', 'instargramID'],
        where: {
            user_id: user_id
        }
    }).then(response => {

        /**Id doesn't exists */
        if (response === null) {
            return occurError(res, 400, "User doesn't exist");
        }

        /** Get UserInfo SUCCESS */
        res.status(200).send(response.dataValues);

    }).catch(() => {
        return occurError(res, 500, "DB Error");
    })


});



/**
 *  API URL /api/v1/auth/updateUserInfo (계정 정보 수정하기)
 */
router.put("/updateUserInfo", (req, res) => {

    /** GetUserInfo request body Exception Hanlder */
    if (basicValidateRequestBody([req.body.user_id, req.body.name, req.body.email]) === false) {
        return occurError(res, 400, "ID Error");
    }

    /** Receive request.body  */
    const { user_id, name, email, instagramID } = req.body;

    User.update({
        name: name,
        email: email,
        instargramID: instagramID
    }, {
        where: { user_id: user_id }
    }).then(() => {

        /** UPDATE USERINFO SUCCESS */
        occurSuccess(res, 200, "update Success");

    }).catch(() => {
        return occurError(res, 500, "DB Error");
    })
});

module.exports = router;