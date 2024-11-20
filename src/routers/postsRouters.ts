import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts, getUser, getPost, getSubs, addPost,editPost } from "../fake-db";

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
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
	// ⭐ TODO
	const { title, link, description, subgroup } = req.body;
	console.log({ title, link, description, subgroup });
	
	const user = req.user;
	const userId = user?.id as number;
	console.log(`userId in /create: `, userId);

	let posts = getPosts();

	const subs = getSubs();
	if (!subs.includes(subgroup)) {
		subs.push(subgroup);
	}
	let newPost = addPost(title, link, userId, description, subgroup);
	posts.unshift(newPost);

	return res.redirect("/"); //DONE
});

router.get("/show/:postid", async (req, res) => {
	// ⭐ TODO	
	const postId = Number(req.params.postid);
	const post = getPost(postId);
	// console.log(`post in individual post: `, post);
	res.render("individualPost", { post, user: req.user }); //DONE
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

  const updatedPost = getPost(postId)   
  
  return res.redirect(`/posts/show/${postId}`);
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

// /comment-create/<%= post.id %>
router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
  }
);

router.post(
  "/comment-delete/:commentid",
  ensureAuthenticated,
  async (req, res) => {}
);

export default router;
