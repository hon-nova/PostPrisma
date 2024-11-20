import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { getUserByEmailAndPassword, getUserById} from '../controller/userController'

const localLogin = new LocalStrategy ({
	usernameField: 'uname',
	passwordField: 'password'
}, async (uname: string, password: string, done: any)=>{
	const user = await getUserByEmailAndPassword(uname, password)
	if (!user){
		return done(null, false, {message: `Couldn't find user with username: ${uname}. Please try again.`})
	}
	if(user.password !== password){
		return done(null, false, {message: `Password is incorrect.`})
	}
	return done(null,user)	
	
})

passport.serializeUser(function(user: Express.User, done: (err:any,id?:number)=> void){
	console.log(`user type Express.User: `, user)
	done(null,user.id)
});

passport.deserializeUser(async function(id: number, done: (err:any,user?: Express.User |false|null)=>void){
	const user = await getUserById(id) as Express.User
	if(user){
		done(null,user)
	} else {
		done({message:"User Not Found."},null)
	}
});

export default passport.use(localLogin)