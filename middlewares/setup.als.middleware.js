const authService = require('../api/auth/auth.service')
const asyncLocalStorage = require('../services/als.service')

module.exports = setupAsyncLocalStorage

async function setupAsyncLocalStorage(req, res, next) {
  const storage = {}
  asyncLocalStorage.run(storage, () => {
    if (!req.cookies) return next()
    const loggedinUser = authService.validateToken(req.cookies.loginToken)

    if (loggedinUser) {
      const alsStore = asyncLocalStorage.getStore()
      alsStore.loggedinUser = loggedinUser
    }
    next()
  })
}