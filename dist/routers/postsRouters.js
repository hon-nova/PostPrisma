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
const db_1 = require("../db");
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postss = yield (0, db_1.getPosts)(20);
    const posts = yield Promise.all(postss.map((post) => __awaiter(void 0, void 0, void 0, function* () {
        let postObject = Object.assign(Object.assign({}, post), { creator: yield (0, db_1.getUser)(post.creator) });
        return postObject;
    })));
    console.log(`posts in root /: `, posts);
    const user = yield req.user;
    res.render("posts", { posts, user });
}));
router.get("/create", checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render("createPosts", { errorMsg: {} });
});
router.post("/create", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, link, description, subgroup } = req.body;
    console.log({ title, link, description, subgroup });
    const user = req.user;
    const userId = user === null || user === void 0 ? void 0 : user.id;
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
    let posts = yield (0, db_1.getPosts)();
    const subs = yield (0, db_1.getSubs)();
    if (!subs.includes(subgroup)) {
        subs.push(subgroup);
    }
    let newPost = yield (0, db_1.addPost)(title, link, userId, description, subgroup);
    posts.unshift(newPost);
    return res.redirect(`/posts/show/${newPost.id}`);
}));
router.get("/show/:postid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = req.query.error || '';
    const postId = Number(req.params.postid);
    const post = yield (0, db_1.getPost)(postId);
    // vote
    const netVotes = (0, db_1.netVotesByPost)(postId);
    const sessionData = req.session.voteData || {};
    const setvoteto = sessionData.setvoteto || 0;
    const updatedNetVotes = sessionData.updatedNetVotes || (0, db_1.netVotesByPost)(postId);
    console.log("Session data from root /:", { setvoteto, updatedNetVotes });
    res.render("individualPost", { post, user: req.user, error, setvoteto, netVotes, updatedNetVotes });
}));
router.get("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    let post = (0, db_1.getPost)(postId);
    console.log(`post in get /edit/:postid`, post);
    res.render('editPost', { post: post });
}));
router.post("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    const { title, link, description, subgroup } = req.body;
    const user = req.user;
    (0, db_1.editPost)(postId, { title, link, description, subgroup });
    return res.redirect(`/posts/show/${postId}`);
}));
router.get("/deleteconfirm/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    const postToDelete = (0, db_1.getPost)(postId);
    res.render('deleteConfirm', { post: postToDelete });
}));
router.post("/delete/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = Number(req.params.postid);
    const post = yield (0, db_1.getPost)(postId);
    (0, db_1.deletePost)(postId);
    return res.redirect(`/subs/show/${post.subgroup}`);
}));
router.post("/comment-create/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description } = req.body;
    const postid = Number(req.params.postid);
    const user = req.user;
    const creator = user === null || user === void 0 ? void 0 : user.id;
    let error = '';
    if (!description) {
        error = "Please provide the comment content.";
        return res.redirect(`/posts/show/${postid}?error=${error}`);
    }
    (0, db_1.addComment)(postid, creator, description);
    return res.redirect(`/posts/show/${postid}`);
}));
router.post("/comment-delete/:commentid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentid = Number(req.params.commentid);
    const post = yield (0, db_1.getPostByCommentId)(commentid);
    (0, db_1.deleteComment)(commentid);
    return res.redirect(`/posts/show/${post === null || post === void 0 ? void 0 : post.id}`);
}));
router.post('/vote/:postid', checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postid = Number(req.params.postid);
    const setvoteto = Number(req.body.setvoteto);
    console.log(`from /vote postid: ${postid}, setvoteto: ${setvoteto}`);
    const sessionData = req.session.voteData || {};
    const currentVote = sessionData.setvoteto || 0;
    const currentNetVotes = sessionData.updatedNetVotes || (0, db_1.netVotesByPost)(postid);
    console.log(`currentVote: ${currentVote}, currentNetVotes: ${currentNetVotes}`);
    let updatedNetVotes = currentNetVotes;
    if (currentVote === setvoteto) {
        updatedNetVotes -= currentVote;
        sessionData.setvoteto = 0;
    }
    else {
        updatedNetVotes += setvoteto - currentVote;
        sessionData.setvoteto = setvoteto;
    }
    sessionData.updatedNetVotes = updatedNetVotes;
    // save to session
    req.session.voteData = sessionData;
    console.log('Updated session data:', req.session.voteData);
    return res.redirect(`/posts/show/${postid}?setvoteto=${setvoteto}&updatedNetVotes=${updatedNetVotes}`);
}));
exports.default = router;
