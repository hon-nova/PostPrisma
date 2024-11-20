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
    res.render("createPosts");
});
router.post("/create", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
}));
router.get("/show/:postid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
    /*
    - `GET /posts/show/:postid`
      - shows post title, post link, timestamp, and creator
      - also has a list of _all comments_ related to this post
        - each of these should show the comment description, creator, and timestamp
        - optionally, each comment could have a link to delete it
      - if you're logged in, a form for commenting should show
    */
    const postId = Number(req.params.postid);
    const post = (0, fake_db_1.getPost)(postId);
    console.log(`post in individual post: `, post);
    res.render("individualPost", { post, user: req.user });
}));
router.get("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
}));
router.post("/edit/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
}));
router.get("/deleteconfirm/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
}));
router.post("/delete/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
}));
router.post("/comment-create/:postid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ⭐ TODO
}));
router.post("/comment-delete/:commentid", checkAuth_1.ensureAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.default = router;
