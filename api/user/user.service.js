const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    add,
    update,
    remove,
}

async function query() {
    try {
        /* FIX - filterBy? */
        const collection = await dbService.getCollection('user')
        let users = await collection.find().toArray()
        console.log('users', users)
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`cannot find user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const collection2 = await collection.find().toArray()
        console.log('collection2.toArray()', collection2)
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`cannot find user ${username}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const newUser = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(newUser)
        return newUser
    } catch (err) {
        logger.error('cannot add user', err)
        throw err
    }
}

async function update(user) {
    try {
        const updatedUser = {
            _id: ObjectId(user._id),
            username: user.username,
            password: user.password,
            fullname: user.fullname,
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: updatedUser._id }, { $set: updatedUser })
        return updatedUser
    } catch (err) {
        console.log('err', err)
        logger.error('cannot update user', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const { deletedCount } = await collection.deleteOne({ _id: ObjectId(userId) })
        return deletedCount
    } catch (err) {
        logger.error('cannot delete user', err)
        throw err
    }
}