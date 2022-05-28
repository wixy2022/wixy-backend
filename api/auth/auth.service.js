const Cryptr = require('cryptr')

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

module.exports = {
    login,
    signup,
    getLoginToken,
    validateToken
}

async function login(username, password) {
    const user = await userService.getByUsername(username)
    console.log('user', user)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname) {
    const saltRounds = 10
    if (!username || !password || !fullname) return Promise.reject('fullname, username and password are required!')
    
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('hash', hash)
    return userService.add({ username, password: hash, fullname })
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