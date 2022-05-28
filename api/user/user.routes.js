const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/require.auth.middleware')
const { getUser, getUsers, addUser, updateUser, deleteUser } = require('./user.controller')
const router = express.Router()

module.exports = router

router.get('/', getUsers)
router.get('/:userId', getUser)
router.post('/', addUser)
router.put('/', updateUser)

router.delete('/:userId', requireAuth, requireAdmin, deleteUser)