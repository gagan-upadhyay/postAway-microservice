import PostModel from '../models/postModels.js';
import logger from '../utils/logger.js';
import { sanitizeField } from '../utils/sanitizeInputs.js';
import { sendEvent } from '../utils/kafkaClient.js';

export const createPost = async (req, res) => {
    try{
        const title = sanitizeField(req.body.title);
        const caption = sanitizeField(req.body.caption);
        const imageUrl = sanitizeField(req.body.imageUrl);
        const userId = sanitizeField(req.user.id); // authMiddleware sets req.user
        const newPost = new PostModel({
            title,
            caption,
            imageUrl,
            userId
        });
        const savedPost = await newPost.save();
        await sendEvent('post-events', {
            type:'PostCreated',
            data:{
                postId:newPost._id,
                userId: newPost.userId,
                title: newPost.title,
            },
        });
        logger.info(savedPost);
        return res.status(201).json({
            message:"Post created successfully",
            post:savedPost
        });

    }catch(err){
        logger.error(err.stack);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getPosts = async (req, res) => {
    try{
        const posts = await PostModel.find();
        logger.info(posts);
        if(!posts || posts.length === 0){
            return res.status(404).json({message:"No posts found"});
        }
        return res.status(200).json(posts).populate('username', 'email', 'title', 'imageUrl', 'caption');
    }catch(err){
        logger.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}


export const getPostById = async (req, res) => {
    try{
        const {id} = req.params;
        const post = await PostModel.findById(id);
        if(!post){
            logger.error("Post not found");
            return res.status(404).json({message:"Post not found"});
            
        }
        logger.info(post);
        return res.status(200).json(post).populate('username', 'email', 'title', 'imageUrl', 'caption');
        
    }catch(err){
        logger.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const updatePost = async (req, res) => {
    try{
        const {id} = req.params;
        const {title, caption, imageUrl} = req.body;
        const updatedPost = await PostModel.findByIdAndUpdate(id, {
            title,
            caption,
            imageUrl
        }, {new:true});
        if(!updatedPost){
            return res.status(404).json({message:"Post not found"});
        }
        logger.info(updatedPost);
        return res.status(200).json({
            message:"Post updated successfully",
            post:updatedPost
        });
    }catch(err){
        logger.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const deletePost = async (req, res) => {
    try{
        const {id} = req.params;
        const deletedPost = await PostModel.findByIdAndDelete(id);
        if(!deletedPost){
            return res.status(404).json({message:"Post not found"});
        }
        logger.info(deletedPost);
        return res.status(200).json({
            message:"Post deleted successfully",
            post:deletedPost
        });
    }catch(err){
        logger.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}