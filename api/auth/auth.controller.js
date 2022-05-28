const authService = require('./auth.service')
const logger = require('../../services/logger.service')

module.exports = {
    login,
    signup,
    logout
}

async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        logger.info('User login:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        console.log('err', err)
        logger.error('Failed to login', err)
        res.status(401).send({ err: 'Failed to login' })
    }
}

async function signup(req, res) {
    const { username, password, fullname } = req.body
    try {
        await authService.signup(username, password, fullname)
        const user = await authService.login(username, password)
        logger.info('User login:', user)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup', err)
        res.status(401).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        logger.error('Failed to Login', err)
        res.status(500).send({ err: 'Failed to logout' })
    }
}