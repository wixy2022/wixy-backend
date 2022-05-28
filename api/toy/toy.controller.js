const toyService = require('./toy.service')
const logger = require('../../services/logger.service')

module.exports = {
    getToys,
    getLabels,
    getToyById,
    addToy,
    updateToy,
    removeToy
}

async function getToys(req, res) {
    try {
        const toys = await toyService.query(req.query || '{}')
        res.send(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

async function getLabels(req, res) {
    try {
        const labels = await toyService.getLabels()
        res.send(labels)
    } catch (err) {
        logger.error('Failed to get labels', err)
        res.status(500).send({ err: 'Failed to get labels' })
    }
}

async function getToyById(req, res) {
    try {
        const { toyId } = req.params

        const toy = await toyService.getById(toyId)
        /* FIX - COUNT BYES 12-24 TO MONGOID */
        if (!toy) return res.status(401).send('Failed to get toy')
        res.send(toy)

    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

async function addToy(req, res) {
    try {
        let toy = req.body
        /* FIX -  */
        //     // toy.creator = loggedInUser

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const savedToy = await toyService.add(toy)
        if (!savedToy) return res.status(401).send('Failed to add toy')
        res.send(savedToy)

    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

async function updateToy(req, res) {
    try {
        /* FIX - user */
        const loggedInUser = null
        const toy = req.body

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const savedToy = await toyService.update(toy, loggedInUser)
        if (!savedToy) return res.status(401).send('Failed to update toy')
        res.send(savedToy)

    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

async function removeToy(req, res) {
    try {
        /* FIX - user */
        const loggedInUser = null
        const { toyId } = req.params

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const deletedCount = await toyService.remove(toyId, loggedInUser)
        if (!deletedCount) return res.status(401).send('Failed to remove toy')
        res.send('toy removed successfully')

    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}