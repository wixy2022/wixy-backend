const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

const gLabels = ["On wheels", "Box game", "Art", "Baby", "Doll", "Puzzle", "Outdoor"] /* FIX - make a collection in mongo */

module.exports = {
    getLabels,
    query,
    getById,
    add,
    update,
    AddToChat,
    remove,
}

function getLabels() {
    /* FIX - labels from mongo */
    return Promise.resolve(gLabels)
}

async function query(filterBy) {
    let criteria = {}
    let { name, inStock, labels, sortBy } = filterBy

    if (name) {
        const regex = new RegExp(name, 'i')
        criteria.name = { $regex: regex }
    }

    if (inStock) {
        inStock = inStock === 'true'
        criteria.inStock = inStock
    }

    if (labels && labels.length > 0) {
        criteria.labels = { $in: labels }
    }

    try {
        const collection = await dbService.getCollection('toy')
        let toys = await collection.find(criteria)
        if (sortBy) toys.collation({ locale: 'en' }).sort({ [sortBy]: 1 }) //collation make it case insensitive

        toys = await toys.toArray()

        toys = toys.map(toy => {
            toy.createdAt = ObjectId(toy._id).getTimestamp()
            return toy
        })

        return toys
    } catch (err) {
        console.log('ERROR: cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: ObjectId(toyId) })
        toy.createdAt = ObjectId(toy._id).getTimestamp()
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        collection.insertOne(toy)
        return toy
    } catch (err) {
        console.log('ERROR: cannot add toy')
        throw err
    }
}

async function update(toy) {
    try {
        const collection = await dbService.getCollection('toy')

        collection.updateOne(
            { _id: ObjectId(toy._id) },
            {
                $set: {
                    name: toy.name,
                    price: toy.price,
                    img: toy.img,
                    labels: toy.labels,
                    inStock: toy.inStock
                }
            }
        )
        return toy
    } catch (err) {
        console.log(`ERROR: cannot update toy ${toy._id}`)
        throw err
    }
}

async function AddToChat(toyId, msg) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: ObjectId(toyId) })
        const chat = toy.chat ? [...toy.chat, msg] : [msg]

        collection.updateOne(
            { _id: ObjectId(toyId) },
            {
                $set: {
                    chat
                }
            }
        )
    } catch (err) {
        console.log(`ERROR: cannot updateChat of toy ${toy._id}`)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const { deletedCount } = await collection.deleteOne({ _id: ObjectId(toyId) })
        return deletedCount
    } catch (err) {
        console.log(`ERROR: cannot remove toy ${toyId}`)
        throw err
    }
}