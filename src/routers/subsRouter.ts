import express from 'express'
import { getPosts } from '../db'
import { TPost } from '../types'

const router = express.Router()

router.get('/list', async(req,res)=>{
	const listss = await getPosts(20)
	const subgroups = listss.map((post:TPost)=> post.subgroup)
	const list = new Set(subgroups)
	const subs = Array.from(list).sort((a:string,b:string)=>a.localeCompare(b))
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