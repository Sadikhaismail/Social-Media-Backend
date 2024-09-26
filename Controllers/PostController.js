const postmodel = require('../Models/PostModel')




module.exports.addpost = async (req, res) => {

    try {
      const addPost = new postmodel(req.body);
      await addPost.save()
      res.status(200).json({ message: 'New post added ', addPost })
  
    } catch (error) {
      res.status(400).json({ message: 'post not added ', error: error.message })
  
    }
  };
  

  module.exports.allpost = async (req, res) => {

    try {
      const allPost = await postmodel.find()
      res.status(200).json({ message: 'all post here ', allPost })
  
    } catch (error) {
      res.status(400).json({ message: 'post not found ',error:error.message })
  
    }
  };



  module.exports.likePost = async (req, res) => {
    try {
        const  postId  = req.params._id;
        const userId = req.body.userId;  
        

        const post = await postmodel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const alreadyLiked = post.likes.includes(userId);
        
        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
            await post.save();
            return res.status(200).json({ message: 'Post unliked', post });
        } else {
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({ message: 'Post liked', post });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};