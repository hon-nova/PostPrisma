"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const checkAuth_1 = require("../middleware/checkAuth");
const fake_db_1 = require("../fake-db");
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield (0, fake_db_1.getPosts)(20).map((post) => {
        // console.log(`creator object: `,getUser(post.creator))
        // console.log(`each return post: `,{...post, creator:getUser(post.creator)})
        return Object.assign(Object.assign({}, post), { creator: (0, fake_db_1.getUser)(post.creator) });
    });
    // console.log(`posts: `,posts)
    const user = yield req.user;
    res.render("posts", { posts, user }); //DONE
}));
router.get("/create", checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render("createPosts", { errorMsg: {} });
});
router.post("/create", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
    const { title, link, description, subgroup } = req.body;
    console.log({ title, link, description, subgroup });
    const user = req.user;
    const userId = user === null || user === void 0 ? void 0 : user.id;
    console.log(`userId in /create: `, userId);
    let errorMsg = {};
    if (!title)
        errorMsg.title = 'Title is required.';
    if (!link)
        errorMsg.link = 'URL link is required.';
    if (!description)
        errorMsg.description = 'Please provide a description.';
    if (!subgroup)
        errorMsg.subgroup = 'Please provide a subgroup.';
    if (Object.keys(errorMsg).length > 0) {
        return res.render('createPosts', { errorMsg });
    }
    let posts = (0, fake_db_1.getPosts)();
    const subs = (0, fake_db_1.getSubs)();
    if (!subs.includes(subgroup)) {
        subs.push(subgroup);
    }
    let newPost = (0, fake_db_1.addPost)(title, link, userId, description, subgroup);
    posts.unshift(newPost);
    // console.log(`newPost id randomly generated: `, newPost.id);
    return res.redirect(`/posts/show/${newPost.id}`); //DONE
}));
router.get("/show/:postid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO	
    const postId = Number(req.params.postid);
    const post = (0, fake_db_1.getPost)(postId);
    const error = req.query.error || '';
    // console.log(`post in individual post: `, post);
    res.render("individualPost", { post, user: req.user, error }); //DONE
}));
router.get("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
    const postId = Number(req.params.postid);
    let post = (0, fake_db_1.getPost)(postId);
    console.log(`post in get /edit/:postid`);
    res.render('editPost', { post: post });
}));
router.post("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
    const postId = Number(req.params.postid);
    const { title, link, description, subgroup } = req.body;
    const user = req.user;
    (0, fake_db_1.editPost)(postId, { title, link, description, subgroup });
    // const updatedPost = getPost(postId)   
    return res.redirect(`/posts/show/${postId}`); //DONE
}));
router.get("/deleteconfirm/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO    
    const postId = Number(req.params.postid);
    const postToDelete = (0, fake_db_1.getPost)(postId);
    res.render('deleteConfirm', { post: postToDelete });
}));
/* `POST /posts/delete/:postid`
- if cancelled, redirect back to the post
- if successful, redirect back to the _sub that the post belonged to_
*/
router.post("/delete/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
    // const postId = Number(req.params.postid)
    // deletePost(postId)
    // const post = getPost(postId)
    // // if(!post) return res.redirect('/list')
    // return res.redirect(`/list/${post.subgroup}`) //DONE
    // ⭐ TODO
    const postId = Number(req.params.postid);
    const post = (0, fake_db_1.getPost)(postId);
    (0, fake_db_1.deletePost)(postId);
    //testing
    const posts = Promise.all(yield (0, fake_db_1.getPosts)(20).map((post) => {
        console.log(`all posts after delete: `, post);
    }));
    console.log(yield posts);
    return res.redirect(`/subs/show/${post.subgroup}`);
}));
router.post("/comment-create/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
    const { description } = req.body;
    const postid = Number(req.params.postid);
    const user = req.user;
    const creator = user === null || user === void 0 ? void 0 : user.id;
    // const post = getPost(postid)
    let error = '';
    if (!description) {
        error = "Please provide the comment content.";
        return res.redirect(`/posts/show/${postid}?error=${error}`);
    }
    (0, fake_db_1.addComment)(postid, creator, description);
    return res.redirect(`/posts/show/${postid}`); //DONE
}));
// "/comment-delete/<%= c.id%>"
router.post("/comment-delete/:commentid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentid = Number(req.params.commentid);
    const post = (0, fake_db_1.getPostByCommentId)(commentid);
    (0, fake_db_1.deleteComment)(commentid);
    return res.redirect(`/posts/show/${post.id}`); //DONE
}));
exports.default = router;
