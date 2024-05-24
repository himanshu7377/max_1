const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
   
    const postId = req.params.postId; // Extract postId from route parameter
    const comment = new Comment({ text, post: postId, author: req.session.userId });
    await comment.save();
    
    
    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();
    // Populate the author field with the author's name
    const populatedComment = await Comment.findById(comment._id).populate('author', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
};









exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    
    const post = await Post.findById(comment.post);
    post.comments.pull(comment._id);
    await post.save();
    
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};



