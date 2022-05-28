const wapService = require('./wap.service')
const logger = require('../../services/logger.service')

module.exports = {
    getWaps,
    getWapById,
    addWap,
    updateWap,
    removeWap
}

async function getWaps(req, res) {
    try {
        const waps = await wapService.query(req.query || '{}')
        res.send(waps)
    } catch (err) {
        logger.error('Failed to get waps', err)
        res.status(500).send({ err: 'Failed to get waps' })
    }
}

async function getWapById(req, res) {
    try {
        const { wapId } = req.params

        const wap = await wapService.getById(wapId)
        /* FIX - COUNT BYES 12-24 TO MONGOID */
        if (!wap) return res.status(401).send('Failed to get wap')
        res.send(wap)

    } catch (err) {
        logger.error('Failed to get wap', err)
        res.status(500).send({ err: 'Failed to get wap' })
    }
}

async function addWap(req, res) {
    try {
        let wap = req.body
        /* FIX -  */
        //     // wap.creator = loggedInUser

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const savedWap = await wapService.add(wap)
        if (!savedWap) return res.status(401).send('Failed to add wap')
        res.send(savedWap)

    } catch (err) {
        logger.error('Failed to add wap', err)
        res.status(500).send({ err: 'Failed to add wap' })
    }
}

async function updateWap(req, res) {
    try {
        /* FIX - user */
        const loggedInUser = null
        const wap = req.body

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const savedWap = await wapService.update(wap, loggedInUser)
        if (!savedWap) return res.status(401).send('Failed to update wap')
        res.send(savedWap)

    } catch (err) {
        logger.error('Failed to update wap', err)
        res.status(500).send({ err: 'Failed to update wap' })
    }
}

async function removeWap(req, res) {
    try {
        /* FIX - user */
        const loggedInUser = null
        const { wapId } = req.params

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const deletedCount = await wapService.remove(wapId, loggedInUser)
        if (!deletedCount) return res.status(401).send('Failed to remove wap')
        res.send('wap removed successfully')
    } catch (err) {
        logger.error('Failed to remove wap', err)
        res.status(500).send({ err: 'Failed to remove wap' })
    }
}