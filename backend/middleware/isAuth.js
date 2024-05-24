


//   const Post = require('./models/Post'); // Adjust path as necessary
// const Comment = require('./models/Comment'); // Adjust path as necessary
const User = require('../models/User'); // Adjust path as necessary

const checkOwnershipOrAdmin = (model) => {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const resource = await model.findById(req.params.id);
      if (!resource) {
        return res.status(404).send("Resource not found");
      }

      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(401).send("Not authenticated");
      }

      if (resource.author.toString() !== req.session.userId && user.role !== 'admin') {
        return res.status(403).send("Permission denied");
      }

      next();
    } catch (error) {
      console.error('Error in checkOwnershipOrAdmin middleware:', error);
      res.status(500).send("Internal server error");
    }
  };
};

module.exports = { checkOwnershipOrAdmin };

  