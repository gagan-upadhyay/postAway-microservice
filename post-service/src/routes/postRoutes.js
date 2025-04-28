import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import { 
    getPosts, 
    getPostById, 
    createPost, 
    deletePost, 
    updatePost 
} from '../controllers/controllers.js';


const router = express.Router();

router.get('/', (req, res)=>{
    res.status(200).send("Welcome to post-service")
    console.log("API Get Request");
})

router.get('/all', authMiddleware, getPosts);
router.get('/posts/:id', authMiddleware, getPostById);
router.post('/', authMiddleware,createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;