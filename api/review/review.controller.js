const reviewService = require('./review.service')
const logger = require('../../services/logger.service')

module.exports = {
    getReviews,
    getReviewById,
    addReview,
    updateReview,
    removeReview
}

async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query(req.query || '{}')
        res.send(reviews)
    } catch (err) {
        logger.error('Failed to get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

async function getReviewById(req, res) {
    try {
        const { reviewId } = req.params

        const review = await reviewService.getById(reviewId)
        /* FIX - COUNT BYES 12-24 TO MONGOID */
        if (!review) return res.status(401).send('Failed to get review')
        res.send(review)

    } catch (err) {
        logger.error('Failed to get review', err)
        res.status(500).send({ err: 'Failed to get review' })
    }
}

async function addReview(req, res) {
    try {
        let review = req.body
        /* FIX -  */
        //     // review.creator = loggedInUser

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const savedReview = await reviewService.add(review)
        if (!savedReview) return res.status(401).send('Failed to add review')
        res.send(savedReview)

    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

async function updateReview(req, res) {
    try {
        /* FIX - user */
        const loggedInUser = null
        const review = req.body

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const savedReview = await reviewService.update(review, loggedInUser)
        if (!savedReview) return res.status(401).send('Failed to update review')
        res.send(savedReview)

    } catch (err) {
        logger.error('Failed to update review', err)
        res.status(500).send({ err: 'Failed to update review' })
    }
}

async function removeReview(req, res) {
    try {
        /* FIX - user */
        const loggedInUser = null
        const { reviewId } = req.params

        /* FIX - COUNT BYES 12-24 TO MONGOID */
        const deletedCount = await reviewService.remove(reviewId, loggedInUser)
        if (!deletedCount) return res.status(401).send('Failed to remove review')
        res.send('review removed successfully')

    } catch (err) {
        logger.error('Failed to remove review', err)
        res.status(500).send({ err: 'Failed to remove review' })
    }
}