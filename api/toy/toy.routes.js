const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/require.auth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getToys, getLabels, getToyById, addToy, updateToy, removeToy } = require('./toy.controller')
const router = express.Router()

module.exports = router

router.get('/', log, getToys) //notice that in here we wanted to log that a request was made (we could do it in all of them)
router.get('/label', getLabels)
router.get('/:toyId', getToyById)
router.post('/', requireAuth, requireAdmin, addToy)
router.put('/', requireAuth, requireAdmin, updateToy)
router.delete('/:toyId', requireAuth, requireAdmin, removeToy)