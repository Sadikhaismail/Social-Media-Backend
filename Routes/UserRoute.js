const express = require ('express')
const router = express.Router()
const usercontroller = require('../Controllers/UserController')
const verifytoken = require('../Middleware/VerifyToken')
const checkrole = require('../Middleware/CheckRole')

router.post('/register',usercontroller.register)
router.post('/login',usercontroller.login)
router.get('/oneuser/:_id',usercontroller.getOneUser)
router.put('/updateuser/:_id',usercontroller.updateUser)
router.get('/alluser',usercontroller.getAllUser)

router.post( '/follow/:id', verifytoken,checkrole(['user']),usercontroller.followUser)
router.post( '/unfollow/:id', verifytoken,checkrole(['user']),usercontroller.unfollowUser)
router.post( '/followers', verifytoken,checkrole(['user']),usercontroller.getFollowers)
router.post( '/following', verifytoken,checkrole(['user']),usercontroller.getFollowing)








module.exports=router