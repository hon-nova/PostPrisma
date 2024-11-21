import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts, getUser, getPost, getSubs, addPost,editPost, getComments, getPostByCommentId, deleteComment, addComment, deletePost } from "../fake-db";

router.get("/", async (req, res) => {
  const posts = await getPosts(20).map((post) => {
		// console.log(`creator object: `,getUser(post.creator))
		// console.log(`each return post: `,{...post, creator:getUser(post.creator)})
		return {
			...post,
			creator: getUser(post.creator),
		};
  });
  // console.log(`posts: `,posts)
  const user = await req.user;
  res.render("posts", { posts, user }); //DONE
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", {errorMsg : {}});
});

router.post("/create", ensureAuthenticated, async (req, res) => {
	// ⭐ TODO
	const { title, link, description, subgroup } = req.body;
	console.log({ title, link, description, subgroup });
	
	const user = req.user;
	const userId = user?.id as number;
	console.log(`userId in /create: `, userId);

  let errorMsg: {[x:string]: string}={}

  if(!title) errorMsg.title='Title is required.'
  
  if(!link) errorMsg.link ='URL link is required.'
  
  if(!description) errorMsg.description ='Please provide a description.'
  
  if(!subgroup) errorMsg.subgroup='Please provide a subgroup.'
  if(Object.keys(errorMsg).length > 0){
     return res.render('createPosts',{ errorMsg})
  }
	let posts = getPosts();

	const subs = getSubs();
	if (!subs.includes(subgroup)) {
		subs.push(subgroup);
	}
	let newPost = addPost(title, link, userId, description, subgroup);
	posts.unshift(newPost);
  // console.log(`newPost id randomly generated: `, newPost.id);
	return res.redirect(`/posts/show/${newPost.id}`); //DONE
});

router.get("/show/:postid", async (req, res) => {
	// ⭐ TODO	
	const postId = Number(req.params.postid);
	const post = getPost(postId);
  
  const error = req.query.error || ''; 
	// console.log(`post in individual post: `, post);
	res.render("individualPost", { post, user: req.user,error }); //DONE
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const postId = Number(req.params.postid)
  let post = getPost(postId)
  console.log(`post in get /edit/:postid`)
  res.render('editPost', { post:post })
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  const postId = Number(req.params.postid)
  
  const {title, link,description,subgroup} = req.body
  const user = req.user 
  
  editPost(postId, {title, link,description,subgroup})
  // const updatedPost = getPost(postId)   
  
  return res.redirect(`/posts/show/${postId}`); //DONE
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO    
  const postId = Number(req.params.postid)
  const postToDelete = getPost(postId)
  res.render('deleteConfirm', { post: postToDelete})
  
});

/* `POST /posts/delete/:postid`
- if cancelled, redirect back to the post
- if successful, redirect back to the _sub that the post belonged to_
*/
router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
  // const postId = Number(req.params.postid)
  // deletePost(postId)
  // const post = getPost(postId)
  // // if(!post) return res.redirect('/list')

  // return res.redirect(`/list/${post.subgroup}`) //DONE
  // ⭐ TODO
  const postId = Number(req.params.postid)
  const post = getPost(postId)

  deletePost(postId)
  //testing
  const posts = Promise.all(await getPosts(20).map((post)=>{
     console.log(`all posts after delete: `,post)
  }))
  console.log(await posts)

  return res.redirect(`/subs/show/${post.subgroup}`)  
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
    const { description } = req.body
    const postid = Number(req.params.postid)
    const user = req.user
    const creator = user?.id as number
    // const post = getPost(postid)
    let error=''
    if(!description) {
      error="Please provide the comment content."
      return res.redirect(`/posts/show/${postid}?error=${error}`)
    }
     
    addComment(postid,creator,description)
    return res.redirect(`/posts/show/${postid}`); //DONE
  }
);
// "/comment-delete/<%= c.id%>"
router.post(
  "/comment-delete/:commentid",
  ensureAuthenticated,
  async (req, res) => {
    const commentid = Number(req.params.commentid);
    const post = getPostByCommentId(commentid);
    deleteComment(commentid);
    return res.redirect(`/posts/show/${post.id}`); //DONE
  }
);
/* So you'll need to add at least this route:

- `POST /posts/vote/:postid/`
- uses a body field `setvoteto` to set vote to +1, -1, or 0, overriding previous vote
- redirects back to `GET /posts/show/:postid`
*/
router.post('/vote/:postid',ensureAuthenticated,async(req,res)=>{
  const { postid } = req.params
})

export default router;
