import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts, getUser, getPost, getSubs, addPost,editPost, getComments, getPostByCommentId, deleteComment, addComment, deletePost, getVotesForPost, netVotesByPost } from "../db";
import { TPost } from "../types";


router.get("/", async (req, res) => {
  const postss = await getPosts(20)
	const posts = await Promise.all(postss.map(async(post) => {
    let postObject = {      
        ...post,
        creator: await getUser(post.creator),    
        };    
    return postObject    
	})
  );
  // console.log(`posts in root /: `, posts)
  const user = await req.user;
  res.render("posts", { posts, user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", {errorMsg : {}});
});

router.post("/create", ensureAuthenticated, async (req, res) => {
	
	const { title, link, description, subgroup } = req.body;
	console.log({ title, link, description, subgroup });
	
	const user = req.user;
	const userId = user?.id as number;

  let errorMsg: {[x:string]: string}={}

  if(!title) errorMsg.title='Title is required.'
  
  if(!link) errorMsg.link ='URL link is required.'
  
  if(!description) errorMsg.description ='Please provide a description.'
  
  if(!subgroup) errorMsg.subgroup='Please provide a subgroup.'
  if(Object.keys(errorMsg).length > 0){
     return res.render('createPosts',{ errorMsg })
  }
	let posts = await getPosts();

	const subs = await getSubs();
	if (!subs.includes(subgroup)) {
		subs.push(subgroup);
	}
	let newPost: TPost = await addPost(title, link, userId, description, subgroup);
	posts.unshift(newPost);
	return res.redirect(`/posts/show/${newPost.id}`); 
});

router.get("/show/:postid", async (req, res) => {

  const error = req.query.error || ''; 
	const postId = Number(req.params.postid);
	const post = await getPost(postId);
  // vote
  const netVotes = netVotesByPost(postId);
  const sessionData = (req.session as any).voteData || {};
  const setvoteto = sessionData.setvoteto || 0;
  const updatedNetVotes = sessionData.updatedNetVotes || netVotesByPost(postId);

  console.log("Session data from show/:postid ", { setvoteto, updatedNetVotes });
	res.render("individualPost", { post, user: req.user,error, setvoteto,netVotes,updatedNetVotes }); 
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  
  const postId = Number(req.params.postid)
  let post = getPost(postId)
  console.log(`post in get /edit/:postid`, post)
  res.render('editPost', { post:post })
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  
  const postId = Number(req.params.postid)
  
  const {title, link,description,subgroup} = req.body
  const user = req.user 
  
  editPost(postId, {title, link,description,subgroup})
  return res.redirect(`/posts/show/${postId}`); 
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  
  const postId = Number(req.params.postid)
  const postToDelete = getPost(postId)
  res.render('deleteConfirm', { post: postToDelete})  
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  
  const postId = Number(req.params.postid)
  const post = await getPost(postId)

  deletePost(postId)

  return res.redirect(`/subs/show/${post.subgroup}`)  
});

router.post("/comment-create/:postid",ensureAuthenticated,async (req, res) => {
    
    const { description } = req.body
    const postid = Number(req.params.postid)
    const user = req.user
    const creator = user?.id as number
    let error=''
    if(!description) {
    error="Please provide the comment content."
    return res.redirect(`/posts/show/${postid}?error=${error}`)
    }
    
    addComment(postid,creator,description)
    return res.redirect(`/posts/show/${postid}`);
  }
);

router.post(
  "/comment-delete/:commentid",
  ensureAuthenticated,
  async (req, res) => {
    const commentid = Number(req.params.commentid);
    const post = await getPostByCommentId(commentid);
    deleteComment(commentid);    
    return res.redirect(`/posts/show/${post?.id}`);
  }
);

router.post('/vote/:postid',ensureAuthenticated,async(req,res)=>{
	const  postid  = Number(req.params.postid)
	const setvoteto  = Number(req.body.setvoteto)
	
	console.log(`from /vote postid: ${postid}, setvoteto: ${setvoteto}`);
	
  const sessionData = (req.session as any).voteData || {};
  const currentVote = sessionData.setvoteto || 0; 
  const currentNetVotes = sessionData.updatedNetVotes || netVotesByPost(postid);
  console.log(`currentVote: ${currentVote}, currentNetVotes: ${currentNetVotes}`);
  let updatedNetVotes = currentNetVotes;
  
  if (currentVote === setvoteto) {    
    updatedNetVotes -= currentVote;
    sessionData.setvoteto = 0; 
  } else {
    
    updatedNetVotes += setvoteto - currentVote;
    sessionData.setvoteto = setvoteto;
  }

  sessionData.updatedNetVotes = updatedNetVotes;

  // save to session
  (req.session as any).voteData = sessionData;

  console.log('Updated session data:', (req.session as any).voteData);
  
	return res.redirect(`/posts/show/${postid}?setvoteto=${setvoteto}&updatedNetVotes=${updatedNetVotes}`);
})

export default router;
