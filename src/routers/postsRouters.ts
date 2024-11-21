import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts, getUser, getPost, getSubs, addPost,editPost, getComments, getPostByCommentId, deleteComment, addComment, deletePost, getVotesForPost, netVotesByPost } from "../fake-db";


router.get("/", async (req, res) => {

	console.log("Query params:", req.query);

	const setvoteto = Number(req.query.setvoteto) || null
	console.log(`main setvoteto: `,setvoteto)
	const postid = Number(req.query.postid) || null

	const posts = await getPosts(20).map((post) => {
		console.log(`object: `,{
			...post,
			creator: getUser(post.creator),
			currentNetVotes: netVotesByPost(post.id),
			setvoteto: post.id === postid ? setvoteto : null,
		})
			return {
			...post,
			creator: getUser(post.creator),
			currentNetVotes: netVotesByPost(post.id),
			setvoteto: post.id === postid ? setvoteto : null,
			};
	});
  // console.log(`posts: `,posts)
  const user = await req.user;
  res.render("posts", { posts, user });
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


router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
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
  const  postid  = Number(req.params.postid)
  const setvoteto  = Number(req.body.setvoteto)
 
  console.log(`postid: ${postid}, setvoteto: ${setvoteto}`);

  if (isNaN(setvoteto) || isNaN(postid)) {
    console.error('Invalid setvoteto or postid');
    return res.redirect('/'); // Fallback in case of invalid data
  }

  return res.redirect(`/?setvoteto=${setvoteto}&postid=${postid}`)
  
})

export default router;
