const express = require('express');
const { createPost, getPosts, getPostById, updatePost, deletePost, LikePost, DislikePost } = require('../controllers/postController');
const { createComment, deleteComment, getComments } = require('../controllers/commentController');

const {checkOwnershipOrAdmin}  = require('../middleware/isAuth.js');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', checkOwnershipOrAdmin(Post),deletePost);

router.post('/posts/:id/like', LikePost);
router.post('/posts/:id/dislike', DislikePost);

router.post('/posts/:postId/comments', createComment);
router.get('/posts/:postId/comments', getComments);
router.delete('/comments/:id', checkOwnershipOrAdmin(Comment),deleteComment);

module.exports = router;
