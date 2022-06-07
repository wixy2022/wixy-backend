const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    updateWap
}

async function query(filterBy) {
    let criteria = _buildCriteria(filterBy)

    /* no use of filterBy for now */

    try {
        const collection = await dbService.getCollection('wap')
        let waps = await collection.find(criteria)

        waps = await waps.toArray()

        waps = waps.map(wap => {
            wap.createdAt = ObjectId(wap._id).getTimestamp()
            return wap
        })

        return waps
    } catch (err) {
        console.log('ERROR: cannot find waps', err)
        throw err
    }
}

async function getById(wapId) {
    try {
        const collection = await dbService.getCollection('wap')
        const wap = await collection.findOne({ _id: ObjectId(wapId) })
        if (!wap) return
        wap.createdAt = ObjectId(wap._id).getTimestamp()
        return wap
    } catch (err) {
        logger.error(`while finding wap ${wapId}`, err)
        throw err
    }

}

async function add(wap) {
    try {
        const collection = await dbService.getCollection('wap')
        collection.insertOne(wap)
        return wap
    } catch (err) {
        console.log('ERROR: cannot add wap')
        throw err
    }
}

async function update(wap) {
    try {
        const collection = await dbService.getCollection('wap')

        collection.updateOne(
            { _id: ObjectId(wap._id) },
            {
                /* FIX - change properties to save */
                $set: {
                    name: wap.name,
                    imgUrl: wap.imgUrl,
                    description: wap.description,
                    cmps: wap.cmps,
                    leads: wap.leads || [],
                    visitors: wap.visitors
                }
            }
        )
        return wap
    } catch (err) {
        console.log(`ERROR: cannot update wap ${wap._id}`)
        throw err
    }
}

async function updateWap(wapId, wap) {
    try {
        if (!wapId) return // fix - empty editor wapId
        const collection = await dbService.getCollection('wap')
        const wap = await collection.findOne({ _id: ObjectId(wapId) })
        await collection.updateOne({ _id: wapId }, { $set: { ...wap } })

        const chat = wap.chat ? [...wap.chat, msg] : [msg]

    } catch (err) {
        console.log(`ERROR: cannot updateWap ${wap._id}`)
        throw err
    }
}

async function remove(wapId) {
    try {
        const collection = await dbService.getCollection('wap')
        const { deletedCount } = await collection.deleteOne({ _id: ObjectId(wapId) })
        return deletedCount
    } catch (err) {
        console.log(`ERROR: cannot remove wap ${wapId}`)
        throw err
    }
}
function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.userId) {
        criteria.creator = ObjectId(filterBy.userId)
    }

    return criteria
}