import express from 'express'
import {
  getPostsBySearch,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/posts.js'
import auth from '../middleware/auth.js'
// in react we can omit .js extension in import but in node you have to write .js extensions.

const router = express.Router()

// localhost:5000/post
router.get('/search', getPostsBySearch)
router.get('/:id', getPost)
router.get('/', getPosts)
router.post('/', auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)

export default router
