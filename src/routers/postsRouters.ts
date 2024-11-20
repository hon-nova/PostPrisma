import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts,getUser } from "../fake-db";

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
  res.render("individualPost");
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

export default router;
