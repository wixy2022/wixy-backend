const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const dbService = require('../../services/db.service')
const { error } = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}

async function login(loggedInUser) {
    const { email, password, isSocial, firstName, lastName, imgUrl } = loggedInUser
    logger.debug(`auth.service - login with email: ${email}`)

    const user = await userService.getByEmail(email)
    console.log('user', user)

    if (user) {
        let match
        if (password) {
            match = await bcrypt.compare(password, user.password)
            console.log('match', match)
        }
        if (!match || !password) {
            if (user.isSocial) return user
            return Promise.reject('Invalid username or password')
        }
        delete user.password
        return user

    } else if (!user && isSocial) {
        return userService.add({ email, firstName, lastName, isSocial, imgUrl })

    }
    else return Promise.reject('Invalid username or password')
}

async function signup(email, password, firstName, lastName) {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ email })
    if (user) {
        throw error('email is already being used')
    }

    const saltRounds = 10
    logger.debug(`auth.service - signup with email: ${email}, fullname: ${firstName} ${lastName}`)
    if (!email || !password || !firstName || !lastName) return Promise.reject('fullname, email and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ email, password: hash, firstName, lastName })
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}