import { TComment , TPost, TPosts, TVote, TUser } from "./types";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function getPostByCommentId(commentId:number){
  //step 1: get the comment
  const comment:TComment = await prisma.comment.findUnique({
    where: {
      id: commentId
    }
  })
  //step 2: retrieve post_id = comment.post_id
  const postId = comment?.post_id
  //step 3: retrieve post by post_id
  return await getPost(postId)
  
}

<<<<<<< HEAD
async function getVotes():Promise<TVote[]> {
  return await prisma.vote.findMany()
}

=======
>>>>>>> 02-posts
function debug() {
  console.log("==== DB DEBUGING ====");
  // console.log("users", users);
  // console.log("posts", getPosts());
  // console.log("comments", getComments());
  // console.log("votes", votes);
  // console.log(`getPostByCommentId(9003): `,getPostByCommentId(9003))
  console.log("==== DB DEBUGING ====");
}

async function getUser(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })
  return user
}
async function getUserByUsername(uname: string):Promise<TUser|null> {
  const user = await prisma.user.findUnique({
    where: {
      uname: uname,
    },
  })
  return user
}

<<<<<<< HEAD
async function getVotesForPost(post_id: number) {
  const votess = await getVotes();
  return await Promise.all(votess.filter((vote:TVote) => vote.post_id === post_id) || undefined);
}

async function decoratePost(post: TPost) {
  const commentss = await getComments();
  const comments = await Promise.all(commentss
    .filter((comment:TComment) => comment.post_id === post.id)
    .map(async(comment:TComment) => ({ ...comment, creator: await getUser(comment.creator) }))
  )     
  const newPost = {
    ...post,
    creator: await getUser(post.id),
    votes: await getVotesForPost(post.id),
    comments: await Promise.all(commentss
      .filter((comment:TComment) => comment.post_id === post.id)
      .map(async(comment:TComment) => ({ ...comment, creator: await getUser(comment.creator) }))
    )     
=======
async function getVotes():Promise<TVote[]>{
  return await prisma.vote.findMany()
}
async function getVotesForPost(post_id: number) {
  const votes = await getVotes()
  return votes.filter((vote:TVote) => vote.post_id === post_id)
}

async function decoratePost(post: TPost) {
  const comments = await getComments();
  const votes = await getVotes()
  const newPost = {
    ...post,
    creator: await getUser(post.id),
    votes: await Promise.all(votes
      .filter((vote)=> vote.post_id === post.id)
      .map(async(vote)=> ({user: await getUser(vote.user_id),value: vote.value}))),
    comments: await Promise.all(comments     
      .filter((comment:TComment) => comment.post_id === post.id)
      .map(async (comment:TComment) => ({ ...comment, creator: await getUser(comment.creator) })))  
>>>>>>> 02-posts
  };
  console.log(`newPost in decoratePost: `,newPost)
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
async function getUsers():Promise<TUser[]>{
  return await prisma.user.findMany()
}

async function getPost(id: number){
  const post:TPost = await prisma.post.findUnique({
    where: {
      id: id
    }
  })
  // console.log(`post in getPost: `, await post)
  console.log(`decoratePost in getPost:`, await decoratePost(post))
  return await decoratePost(post);
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

async function editPost(
  post_id: number,
  changes: {
    title?: string;
    link?: string;
    description?: string;
    subgroup?: string;
  } = {}
) {
  // let post = posts[post_id];
  let post = await getPost(post_id)
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

async function deletePost(post_id: number) {
  await prisma.post.delete({
    where: {
      id: post_id,
    },
  });
}

async function getSubs() {
  let posts = await getPosts();
  return posts.map((post) => post.subgroup);
}

async function getComments(){
	return await prisma.comment.findMany()
}
async function deleteComment(commentid:number){
  await prisma.comment.delete({
    where: {
      id: commentid,
    },
  });
}

async function netVotesByPost(postId:number): Promise<number>{
  let votes = await getVotesForPost(postId)
  let netVotes = votes.reduce((acc,{value})=> acc + value,0)
  
  return netVotes
}

async function addComment(post_id: number, creator: number, description: string): Promise<TComment> {  
  // comments[id] = comment;
  let comment = await prisma.comment.create({
    data :{
      post_id: Number(post_id),
      creator: Number(creator),
      description,
      timestamp: Date.now(),
    }
  })
  return comment;
}
(async()=>{
  // console.log(`posts: `,await getPosts())
  // console.log(`users: `, await getUsers())
  // console.log(`comments: `, await getComments())
  // console.log('getUserByUsername("alice"):', await getUserByUsername("alice"))
<<<<<<< HEAD
=======
  // console.log(`getVotesForPost(1): `, await getVotesForPost(1)) 
  // console.log(`getVotesForPost(3): `, await getVotesForPost(3)) 
>>>>>>> 02-posts
})()

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
