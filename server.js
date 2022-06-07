/* FIX - COMMENTS 
1. MongoDBId requires 12-24 bytes (if the given userid is incorrect we get 500 now (instead of 400))    
2. public/ - enter new pictures for logo192 and logo512
3. services/socket.service.js -
    a. line 32 - wapService.AddToChat
    b. line 37 - not sure, maby it need to stay
4. utilService is empty
*/

const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

const webpush = require('web-push')
const bodyParser = require('body-parser')



const app = express();
const http = require('http').createServer(app) /* surrounding http let us use WebSockets */

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'));



const publicVapidKey = 'BL5K2ebzwnuwBgEQDwtJt5EYi10JeixdhoEwgp2_DS23_U0FjCwZlZ-y97bHlYdMrg61IPxYKXNwvtE5f8eoqpo'
const privateVapidKey = 'E2wEkTbcUYgPBDr9cXQKn4vXWYlnT7QjGz9Ro4Dxm6s'


webpush.setVapidDetails('mailto:ilovebpxd@gmail.com', publicVapidKey, privateVapidKey)


if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }

    app.use(bodyParser.json())
    app.use(cors(corsOptions))
}
app.post('/subscribe/:Sss?', (req, res) => {
    const {Sss} = req.params
    const subsciption = req.body

    console.log('hey im log')
    const { title, body ,wapId} = req.query
    res.status(201).json({})
    const payload = JSON.stringify({ title, body,wapId })
    webpush.sendNotification(subsciption, payload).catch(err => console.error(err))
})
//routes
const setupAsyncLocalStorage = require('./middlewares/setup.als.middleware')
app.all('*', setupAsyncLocalStorage)

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const wapRoutes = require('./api/wap/wap.routes')
const { setupSocketAPI } = require('./services/socket.service')

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/wap', wapRoutes)
setupSocketAPI(http)


/* LAST FALLBACK */
app.get('/**', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

const PORT = process.env.PORT || 3030

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});