// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
  const { title, body } = req.body;
  if (!req.session.userId) {
    return res.status(401).send("Not authenticated");
  }
  console.log( 'reqsession',req.session);
  try {
    const newPost = new Post({
      title,
      body,
      author: req.session.userId
    });
    const savedPost = await newPost.save();
    res.status(201).send(savedPost);
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).send("Error saving post");
  }
};


const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'name');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedFields = req.body;
    updatedFields.author = post.author; // Ensure the author field is preserved

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedFields, { new: true }).populate('author');
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating post from backend', error });
  }
};



const findUserRole = async (userId) => {
  try {
    // 1. Fetch user data based on userId
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found'); // Handle non-existent user
    }

    // 2. Extract user role from the fetched data
    const role = user.role; // Assuming 'role' field exists in the User model

    // 3. Return the user role
    return role;
  } catch (error) {
    console.error('Error finding user role:', error);
    // Handle errors gracefully (e.g., log error, return a default role)
    return null; // Or provide a default role (e.g., 'guest') based on your requirements
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = req.session.userId;
    console.log('user', user);

    const userRole = await findUserRole(user);
    if (userRole !== 'admin' && post.author.toString() !== user) {
      return res.status(401).json({ message: 'Unauthorized deletion attempt' });
    }

    // if (post.author.toString() !== req.session.userId) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error deleting post', error });
  }
}




// Like a post
// Like a post
const LikePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes += 1;
    post = await post.save(); // Save the updated post
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error liking post', error });
  }
};

// Dislike a post
const DislikePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes > 0) {
      post.likes -= 1;
    }
    post = await post.save(); // Save the updated post
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error disliking post', error });
  }
};







module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  LikePost,
  DislikePost
};
