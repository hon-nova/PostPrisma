import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts,getUser, getPost } from "../fake-db";

router.get("/", async (req, res) => {
  const posts = await getPosts(20).map((post)=> {
    // console.log(`creator object: `,getUser(post.creator))
    // console.log(`each return post: `,{...post, creator:getUser(post.creator)})
    return {
      ...post,
      creator:getUser(post.creator)
    }
  })
  // console.log(`posts: `,posts)
  const user = await req.user;
  res.render("posts", { posts, user }); //DONE
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.get("/show/:postid", async (req, res) => {
  // ⭐ TODO
  /*
  - `GET /posts/show/:postid`
    - shows post title, post link, timestamp, and creator
    - also has a list of _all comments_ related to this post
      - each of these should show the comment description, creator, and timestamp
      - optionally, each comment could have a link to delete it
    - if you're logged in, a form for commenting should show
  */
  const postId = Number(req.params.postid)
  const post = getPost(postId)
  console.log(`post in individual post: `,post)
  res.render("individualPost",{ post, user: req.user });
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
  }
);
router.post("/comment-delete/:commentid", ensureAuthenticated, async (req, res) => {  })

export default router;
