import { NextFunction, Request, Response } from 'express';	

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/auth/login');
}
function forwardAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
export { ensureAuthenticated, forwardAuthenticated };