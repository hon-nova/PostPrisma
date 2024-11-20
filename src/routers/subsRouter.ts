import express from 'express'
import { getPosts } from '../fake-db'

const router = express.Router()

router.get('/list', (req,res)=>{
	const list = new Set(getPosts(20).map(post=>post.subgroup))
	const subs = Array.from(list).sort((a,b)=>a.localeCompare(b))
	// console.log(`subs: `, subs)
	res.render('subs',{ subs })
})

router.get('/show/:subname',(req,res)=>{
	const  subName  = req.params.subname
	const posts = getPosts(20,subName)
	// console.log(`posts each sub: `, posts)	
	res.render("sub", { posts });
})
export default router;