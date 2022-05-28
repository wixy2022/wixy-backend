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

const app = express();
const http = require('http').createServer(app) /* surrounding http let us use WebSockets */

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'));

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
    app.use(cors(corsOptions))
}

//routes
const setupAsyncLocalStorage = require('./middlewares/setup.als.middleware')
app.all('*', setupAsyncLocalStorage)

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const wapRoutes = require('./api/wap/wap.routes')
const {setupSocketAPI} = require('./services/socket.service')

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