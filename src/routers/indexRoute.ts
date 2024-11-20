import express, {Request, Response } from 'express';
const router = express.Router()


// router.get('/about', (req: Request, res: Response) => {	
// 	res.send(`Welcome Page`)
// })
router.get('/', (req: Request, res: Response) => {	
	res.redirect('/posts')
});


export default router;