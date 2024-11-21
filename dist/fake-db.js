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
exports.netVotesByPost = void 0;
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
const users = {
    1: {
        id: 1,
        uname: "alice",
        password: "alpha",
    },
    2: {
        id: 2,
        uname: "theo",
        password: "123",
    },
    3: {
        id: 3,
        uname: "prime",
        password: "123",
    },
    4: {
        id: 4,
        uname: "leerob",
        password: "123",
    },
};
const posts = {
    101: {
        id: 101,
        title: "Mochido opens its new location in Coquitlam this week",
        link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
        description: "New mochi donut shop, Mochido, is set to open later this week.",
        creator: 1,
        subgroup: "food",
        timestamp: 1643648446955,
    },
    102: {
        id: 102,
        title: "2023 State of Databases for Serverless & Edge",
        link: "https://leerob.io/blog/backend",
        description: "An overview of databases that pair well with modern application and compute providers.",
        creator: 4,
        subgroup: "coding",
        timestamp: 1642611742010,
    },
    333: {
        id: 333,
        title: "Exploring AI Trends in 2024",
        link: "https://www.ibm.com/think/insights/artificial-intelligence-trends",
        description: "A detailed analysis of emerging AI technologies shaping the future.",
        creator: 3,
        subgroup: "technology",
        timestamp: 1700462345000,
    },
};
const comments = {
    9001: {
        id: 9001,
        post_id: 102,
        creator: 1,
        description: "Actually I learned a lot.",
        timestamp: 1642691742010,
    },
    9002: {
        id: 9002,
        post_id: 101,
        creator: 1,
        description: "This is a fantastic post! It’s well-researched and provides valuable insights",
        timestamp: 1642691742010,
    },
    9003: {
        id: 9003,
        post_id: 333,
        creator: 3,
        description: "I really appreciate myself about the clarity and depth of this explanation",
        timestamp: 1642691742010,
    },
};
function getPostByCommentId(commentId) {
    return getPosts().filter((post) => post.id === comments[commentId].post_id)[0];
}
const votes = [
    { user_id: 2, post_id: 101, value: +1 },
    { user_id: 3, post_id: 101, value: +1 },
    { user_id: 4, post_id: 101, value: +1 },
    { user_id: 3, post_id: 102, value: -1 },
];
function debug() {
    console.log("==== DB DEBUGING ====");
    console.log("users", users);
    // console.log("posts", posts);
    //   console.log("comments", comments);
    // console.log("votes", votes);
    // console.log(`getPostByCommentId(9003): `,getPostByCommentId(9003))
    console.log("==== DB DEBUGING ====");
}
function getUser(id) {
    return users[id];
}
function getUserByUsername(uname) {
    return getUser(Object.values(users).filter((user) => user.uname === uname)[0].id);
}
function getVotesForPost(post_id) {
    return votes.filter((vote) => vote.post_id === post_id) || undefined;
}
function decoratePost(post) {
    const newPost = Object.assign(Object.assign({}, post), { creator: users[post.creator], votes: getVotesForPost(post.id), comments: Object.values(comments)
            .filter((comment) => comment.post_id === post.id)
            .map((comment) => (Object.assign(Object.assign({}, comment), { creator: users[comment.creator] }))) });
    return newPost;
}
/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, sub = undefined) {
    let allPosts = Object.values(posts);
    if (sub) {
        allPosts = allPosts.filter((post) => post.subgroup === sub);
    }
    allPosts.sort((a, b) => b.timestamp - a.timestamp);
    return allPosts.slice(0, n);
}
function getPost(id) {
    return decoratePost(posts[id]);
}
function addPost(title, link, creator, description, subgroup) {
    let id = Math.max(...Object.keys(posts).map(Number)) + 1;
    let post = {
        id,
        title,
        link,
        description,
        creator: Number(creator),
        subgroup,
        timestamp: Date.now(),
    };
    posts[id] = post;
    return post;
}
function editPost(post_id, changes = {}) {
    let post = posts[post_id];
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
}
function deletePost(post_id) {
    delete posts[post_id];
}
function getSubs() {
    return Array.from(new Set(Object.values(posts).map((post) => post.subgroup)));
}
function getComments() {
    return Array.from(Object.values(comments));
}
function deleteComment(commentid) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentToDelete = yield Object.values(comments).find((comment) => comment.id === commentid);
        if (commentToDelete) {
            delete comments[commentToDelete.id];
        }
    });
}
const netVotesByPost = (postId) => {
    let votes = getVotesForPost(postId);
    let netVotes = votes.reduce((acc, { value }) => acc + value, 0);
    return netVotes;
};
exports.netVotesByPost = netVotesByPost;
(() => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(`getPostByCommentId(9003): `,getPostByCommentId(9003))
    // console.log(`getVotesForPost(101): `,getVotesForPost(101))
    // console.log(`getVotesForPost(102): `,getVotesForPost(102))
    // console.log(`netVotesByPost(101): `,netVotesByPost(101))
    // console.log(`netVotesByPost(102): `,netVotesByPost(102))
}))();
function addComment(post_id, creator, description) {
    let id = Math.max(...Object.keys(comments).map(Number)) + 1;
    let comment = {
        id,
        post_id: Number(post_id),
        creator: Number(creator),
        description,
        timestamp: Date.now(),
    };
    comments[id] = comment;
    return comment;
}
