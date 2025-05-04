import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import { 
    getPosts, 
    getPostById, 
    createPost, 
    deletePost, 
    updatePost
} from '../controllers/controllers.js';
import {postValidator} from '../middlewares/ValidationMiddleware.js'


const router = express.Router();

router.get('/', (req, res)=>{
    res.status(200).send("Welcome to post-service")
    console.log("API Get Request");
});

router.get('/all', authMiddleware, getPosts); //test done
router.get('/:id', authMiddleware, getPostById); //test done
router.post('/', postValidator ,authMiddleware,createPost); //Test Done
router.put('/:id', authMiddleware, updatePost); //
router.delete('/:id', authMiddleware, deletePost);

export default router;