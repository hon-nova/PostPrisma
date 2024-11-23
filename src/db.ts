import { TComments, TPost, TPosts, TUsers, TVotes } from "./types";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const users: TUsers = {
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
const posts: TPosts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam this week",
    link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
    description:
      "New mochi donut shop, Mochido, is set to open later this week.",
    creator: 1,
    subgroup: "food",
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "2023 State of Databases for Serverless & Edge",
    link: "https://leerob.io/blog/backend",
    description:
      "An overview of databases that pair well with modern application and compute providers.",
    creator: 4,
    subgroup: "coding",
    timestamp: 1642611742010,
  },
  333: {
    id: 333,
    title: "Exploring AI Trends in 2024",
    link: "https://www.ibm.com/think/insights/artificial-intelligence-trends",
    description:
      "A detailed analysis of emerging AI technologies shaping the future.",
    creator: 3,
    subgroup: "technology",
    timestamp: 1700462345000,
  },
};
const comments: TComments = {
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
    description:
      "This is a fantastic post! It’s well-researched and provides valuable insights",
    timestamp: 1642691742010,
  },
  9003: {
    id: 9003,
    post_id: 333,
    creator: 3,
    description:
      "I really appreciate myself about the clarity and depth of this explanation",
    timestamp: 1642691742010,
  },
};
async function getPostByCommentId(commentId:number):Promise<TPost>{
  let posts = await getPosts()
	return posts.filter((post:TPost)=>post.id === comments[commentId].post_id)[0]
}

const votes: TVotes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
];

function debug() {
  console.log("==== DB DEBUGING ====");
  // console.log("users", users);
  // console.log("posts", posts);
  // console.log("comments", comments);
  // console.log("votes", votes);
  // console.log(`getPostByCommentId(9003): `,getPostByCommentId(9003))
  console.log("==== DB DEBUGING ====");
}

function getUser(id: number) {
  return users[id];
}

function getUserByUsername(uname: any) {
  return getUser(
    Object.values(users).filter((user) => user.uname === uname)[0].id
  );
}

function getVotesForPost(post_id: number) {
  return votes.filter((vote) => vote.post_id === post_id) || undefined;
}

function decoratePost(post: TPost) {
  const newPost = {
    ...post,
    creator: users[post.creator],
    votes: getVotesForPost(post.id),
    comments: Object.values(comments)
      .filter((comment) => comment.post_id === post.id)
      .map((comment) => ({ ...comment, creator: users[comment.creator] })),
  };
  return newPost;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
async function getPosts(n = 5, sub: string | undefined = undefined):Promise<TPost[]> {
  
  let allPosts = await prisma.post.findMany()
  //  set more condition with filter if you will: const posts_filter = await pr  
  if (sub) {
      allPosts = allPosts.filter((post:TPost) => post.subgroup === sub);
    }
  allPosts.sort((a:TPost, b:TPost) => (b.timestamp > a.timestamp ? 1: -1));
  return allPosts.slice(0, n);

}
async function getUsers():Promise<TUsers[]>{
  return await prisma.user.findMany()
}
(async()=>{
  console.log(`posts: `,await getPosts())
  // console.log(`users: `, await getUsers())
})()

function getPost(id: number) {
  return decoratePost(posts[id]);
}

async function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) {  
  const post = await prisma.post.create({
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
}

function editPost(
  post_id: number,
  changes: {
    title?: string;
    link?: string;
    description?: string;
    subgroup?: string;
  } = {}
) {
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

function deletePost(post_id: number) {
  delete posts[post_id];
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map((post) => post.subgroup)));
}

function getComments(){
	return Array.from(Object.values(comments))
}
async function deleteComment(commentid:number){

   const commentToDelete= await Object.values(comments).find((comment)=>comment.id === commentid)
   if(commentToDelete){
      delete comments[commentToDelete.id]
   }
}

const netVotesByPost = (postId:number): number=>{
  let votes = getVotesForPost(postId)
  let netVotes = votes.reduce((acc,{value})=> acc + value,0)
  
  return netVotes
}
  
(async () => {  
  

})();

function addComment(post_id: number, creator: number, description: string) {
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

export {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  decoratePost,
  getComments,
  getPostByCommentId,
  deleteComment,
  getVotesForPost,
  netVotesByPost
};
