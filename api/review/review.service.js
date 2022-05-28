const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
}

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')

        let reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'userId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'toyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'byToy',
                },
            },
            {
                $unwind: '$byToy',
            },
        ]).toArray()

        reviews = reviews.map(review => {
            review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
            review.byToy = { _id: review.byToy._id, fullname: review.byToy.name }
            review.createdAt = ObjectId(review._id).getTimestamp()
            delete review.userId
            delete review.toyId
            return review
        })

        return reviews
    } catch (err) {
        console.log('ERROR: cannot find reviews', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.userId = ObjectId(filterBy.byUserId)
    if (filterBy.byToyId) criteria.toyId = ObjectId(filterBy.byToyId)
    return criteria
}

async function getById(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        const review = await collection.findOne({ _id: ObjectId(reviewId) })
        review.createdAt = ObjectId(review._id).getTimestamp()
        return review
    } catch (err) {
        logger.error(`while finding review ${reviewId}`, err)
        throw err
    }
}

async function add(review) {
    try {
        const reviewToAdd = {
            toyId: ObjectId(review.toyId),
            userId: ObjectId(review.userId),
            content: review.content,
            rate: review.rate
        }

        const collection = await dbService.getCollection('review')
        collection.insertOne(reviewToAdd)

        return review
    } catch (err) {
        console.log('ERROR: cannot add review')
        throw err
    }
}

async function update(review) {
    try {
        const collection = await dbService.getCollection('review')

        collection.updateOne(
            { _id: ObjectId(review._id) },
            {
                $set: {
                    rate: review.rate,
                    content: review.content,
                    userId: review.userId,
                    toyId: review.toyId
                }
            }
        )
        return review
    } catch (err) {
        console.log(`ERROR: cannot update review ${review._id}`)
        throw err
    }
}

async function remove(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        const { deletedCount } = await collection.deleteOne({ _id: ObjectId(reviewId) })
        return deletedCount
    } catch (err) {
        console.log(`ERROR: cannot remove review ${reviewId}`)
        throw err
    }
}