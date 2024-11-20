import express from 'express'
import passport from '../middleware/passport'
import { forwardAuthenticated } from "../middleware/checkAuth";
import { IVerifyOptions } from "passport-local";

const router = express.Router()

router.get('/login', forwardAuthenticated, async(req, res) => {
	//message here
	const messages = (req.session as any).messages || [];
  (req.session as any).messages = [];
  res.render("login", { messages });
	
})
router.post("/login", (req, res, next) => {
	passport.authenticate(
	  "local",
	  { failureRedirect: "auth/login", failureMessage: true },
	  
	  (err: Error, user: Express.User, info: IVerifyOptions) => {
			if (err) {
				return next(err);
			} 
			if (!user) {
				(req.session as any).messages = info
				? [info.message]
				: ["Login failed"];
				return res.redirect("/auth/login");
			}
			req.logIn(user, (err) => {
				if (err) {
				return next(err);
				}			
				return res.redirect("/");			
			});
	  }
	)(req, res, next);
 });
 
router.get('/logout', (req,res,next)=>{
	req.logout(function(err){
		if(err){
			return next(err)
		}		
	})
	res.redirect('/')
})


export default router;