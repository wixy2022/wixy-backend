const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/require.auth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getWaps, getLabels, getWapById, addWap, updateWap, removeWap } = require('./wap.controller')
const router = express.Router()

module.exports = router

router.get('/', log, getWaps) //notice that in here we wanted to log that a request was made (we could do it in all of them)
router.get('/:wapId', getWapById)
router.post('/', addWap)
router.put('/', updateWap)
router.delete('/:wapId', removeWap)