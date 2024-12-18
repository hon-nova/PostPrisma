import express from 'express'
import session from 'express-session'
import passport from './middleware/passport'
import path from 'path'
import { debug } from './db'
const  PORT = process.env.PORT || 8000


const app = express()

app.set("trust proxy", 1)	
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname,'../src/public')));
app.use(session({
	secret:"secret",
	resave:true,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: false,
		maxAge: 24 * 60 * 60 * 1000
	}
}))

import indexRoute from './routers/indexRoute'
import authRoute from './routers/authRoute'
import postsRoute from './routers/postsRouters'
import subsRoute from './routers/subsRouter'


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(passport.initialize())	
app.use(passport.session())

app.use('/',indexRoute)
app.use('/auth',authRoute)
app.use('/posts',postsRoute)
app.use('/subs', subsRoute)
// debug()


app.listen(PORT, () => {
	console.log(`HI, Server is running at: http://localhost:${PORT}`)
});