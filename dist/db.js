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
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = debug;
exports.getUser = getUser;
exports.getUserByUsername = getUserByUsername;
exports.getPosts = getPosts;
exports.getPost = getPost;
exports.addPost = addPost;
exports.editPost = editPost;
exports.deletePost = deletePost;
exports.getSubs = getSubs;
exports.addComment = addComment;
exports.decoratePost = decoratePost;
exports.getComments = getComments;
exports.getPostByCommentId = getPostByCommentId;
exports.deleteComment = deleteComment;
exports.getVotesForPost = getVotesForPost;
exports.netVotesByPost = netVotesByPost;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getPostByCommentId(commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        //step 1: get the comment
        const comment = yield prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });
        //step 2: retrieve post_id = comment.post_id
        const postId = comment === null || comment === void 0 ? void 0 : comment.post_id;
        //step 3: retrieve post by post_id
        return yield getPost(postId);
    });
}
function debug() {
    console.log("==== DB DEBUGING ====");
    // console.log("users", users);
    // console.log("posts", getPosts());
    // console.log("comments", getComments());
    // console.log("votes", votes);
    // console.log(`getPostByCommentId(9003): `,getPostByCommentId(9003))
    console.log("==== DB DEBUGING ====");
}
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        return user;
    });
}
function getUserByUsername(uname) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({
            where: {
                uname: uname,
            },
        });
        return user;
    });
}
function getVotes() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.vote.findMany();
    });
}
function getVotesForPost(post_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const votes = yield getVotes();
        return votes.filter((vote) => vote.post_id === post_id);
    });
}
function decoratePost(post) {
    return __awaiter(this, void 0, void 0, function* () {
        const comments = yield getComments();
        const votes = yield getVotes();
        const newPost = Object.assign(Object.assign({}, post), { creator: yield getUser(post.id), votes: yield Promise.all(votes
                .filter((vote) => vote.post_id === post.id)
                .map((vote) => __awaiter(this, void 0, void 0, function* () { return ({ user: yield getUser(vote.user_id), value: vote.value }); }))), comments: yield Promise.all(comments
                .filter((comment) => comment.post_id === post.id)
                .map((comment) => __awaiter(this, void 0, void 0, function* () { return (Object.assign(Object.assign({}, comment), { creator: yield getUser(comment.creator) })); }))) });
        console.log(`newPost in decoratePost: `, newPost);
        return newPost;
    });
}
/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts() {
    return __awaiter(this, arguments, void 0, function* (n = 5, sub = undefined) {
        let allPosts = yield prisma.post.findMany();
        //  set more condition with filter if you will: const posts_filter = await pr  
        if (sub) {
            allPosts = allPosts.filter((post) => post.subgroup === sub);
        }
        allPosts.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
        return allPosts.slice(0, n);
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.findMany();
    });
}
function getPost(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield prisma.post.findUnique({
            where: {
                id: id
            }
        });
        // console.log(`post in getPost: `, await post)
        console.log(`decoratePost in getPost:`, yield decoratePost(post));
        return yield decoratePost(post);
    });
}
function addPost(title, link, creator, description, subgroup) {
    return __awaiter(this, void 0, void 0, function* () {
        const post = yield prisma.post.create({
            data: {
                title,
                link,
                description,
                creator: Number(creator),
                subgroup,
                timestamp: Date.now(),
            },
        });
        return post;
    });
}
function editPost(post_id_1) {
    return __awaiter(this, arguments, void 0, function* (post_id, changes = {}) {
        // let post = posts[post_id];
        let post = yield getPost(post_id);
        if (changes.title) {
            post.title = changes.title;
        }
        if (changes.link) {
            post.link = changes.link;
        }
        if (changes.description) {
            post.description = changes.description;
        }
        if (changes.subgroup) {
            post.subgroup = changes.subgroup;
        }
    });
}
function deletePost(post_id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.post.delete({
            where: {
                id: post_id,
            },
        });
    });
}
function getSubs() {
    return __awaiter(this, void 0, void 0, function* () {
        let posts = yield getPosts();
        return posts.map((post) => post.subgroup);
    });
}
function getComments() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.comment.findMany();
    });
}
function deleteComment(commentid) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.comment.delete({
            where: {
                id: commentid,
            },
        });
    });
}
function netVotesByPost(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        let votes = yield getVotesForPost(postId);
        let netVotes = votes.reduce((acc, { value }) => acc + value, 0);
        return netVotes;
    });
}
function addComment(post_id, creator, description) {
    return __awaiter(this, void 0, void 0, function* () {
        // comments[id] = comment;
        let comment = yield prisma.comment.create({
            data: {
                post_id: Number(post_id),
                creator: Number(creator),
                description,
                timestamp: Date.now(),
            }
        });
        return comment;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(`posts: `,await getPosts())
    // console.log(`users: `, await getUsers())
    // console.log(`comments: `, await getComments())
    // console.log('getUserByUsername("alice"):', await getUserByUsername("alice"))
    // console.log(`getVotesForPost(1): `, await getVotesForPost(1)) 
    // console.log(`getVotesForPost(3): `, await getVotesForPost(3)) 
}))();
