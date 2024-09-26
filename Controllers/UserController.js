const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usermodel = require('../Models/UserModel');


module.exports.register = async (req, res) => {
    try {
        const isExist = await usermodel.findOne({ email: req.body.email });
        if (!isExist) {
            const adduser = new usermodel(req.body);
            await adduser.save();
            res.status(200).json({ message: "user added", adduser });
        } else {
            res.status(409).json({ message: "user already exists" });
        }
    } catch (error) {
        res.status(409).json({ message: "user cannot be added", error: error.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const isExist = await usermodel.findOne({ email: req.body.email });
        if (!isExist) {
            return res.status(409).json({ message: "user not found" });
        }



        const isMatch = await bcrypt.compare(req.body.password, isExist.password);

        if (isMatch) {
            const token = jwt.sign(
                { username: isExist.username, role: isExist.role, id: isExist._id },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );
            res.cookie('accessToken', token, { httpOnly: true, maxAge: 3600000 });
            return res.status(200).json({ message: "login success" });
        } else {
            return res.status(400).json({ message: "invalid password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};















module.exports.protected = async (req, res) => {
    try {
        res.status(400).json({ message: `This is a protected route, ${req.user.username}` });
    } catch (error) {
        res.status(405).json({ message: "Access denied", error: error });
    }
};

module.exports.getAllUser = async (req, res) => {
    try {
        const allusers = await usermodel.find();
        res.status(200).json({ message: "All users here", allusers });
    } catch {
        res.status(400).json({ message: "Users not found", allusers });
    }
};



module.exports.getOneUser = async (req, res) => {
    try {
        const user = await usermodel.findById(req.params._id);
        if (user) {
            res.status(200).json({ message: "User is here", user });
        }
    } catch (error) {
        res.status(400).json({ message: "Error finding user", error: error.message });
    }
};

module.exports.updateUser = async (req, res) => {
    try {
        const user = await usermodel.findByIdAndUpdate(
            req.params._id,
            req.body,
            { new: true }
        );
        if (user) {
            res.status(200).json({ message: "User updated successfully", user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error updating user", error: error.message });
    }
};





module.exports.followUser = async (req, res) => {
    try {
        const { followingId } = req.body; 

        
        const userToFollow = await usermodel.findById(followingId);
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        if (userToFollow.followers.includes(req.user.id)) {
            console.log(req.user.id);
            
            return res.status(400).json({ message: 'You are already following this user' });
        }

        userToFollow.followers.push(req.user.id);
        await userToFollow.save();

        const currentUser = await usermodel.findById(req.user.id);
        currentUser.following.push(followingId);
        await currentUser.save();

        return res.status(200).json({ message: 'Following successfully', userToFollow, currentUser });

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};



module.exports.unfollowUser = async (req, res) => {
    try {
        const { unfollowingId } = req.body; 

        const userToUnfollow = await usermodel.findById(unfollowingId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!userToUnfollow.followers.includes(req.user.id)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId.toString() !== req.user.id);
        await userToUnfollow.save();

        const currentUser = await usermodel.findById(req.user.id);
        currentUser.following = currentUser.following.filter(followingId => followingId.toString() !== unfollowingId);
        await currentUser.save();

        return res.status(200).json({ message: 'Unfollowed successfully', userToUnfollow, currentUser });

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


module.exports.getFollowers = async (req, res) => {
    try {
        const { userId } = req.body; 
        const user = await usermodel.findById(userId).populate('followers', 'username email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Followers retrieved successfully', followers: user.followers });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports.getFollowing = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await usermodel.findById(userId).populate('following', 'username email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Following list retrieved successfully', following: user.following });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


