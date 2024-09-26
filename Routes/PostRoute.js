const express = require ('express')
const router = express.Router()
const postcontroller = require ('../Controllers/PostController')
const checkrole = require('../Middleware/CheckRole')
const verifytoken = require('../Middleware/VerifyToken')

router.get('/allpost',postcontroller.allpost)
router.post( '/newpost', verifytoken,checkrole(['user']),postcontroller.addpost)
router.post( '/like/:_id', verifytoken,checkrole(['user']),postcontroller.likePost)




module.exports=router