import  request  from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import PostModel from "../src/models/postModels.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { token } from "morgan";



dotenv.config();

let mongoServer;

beforeAll(async ()=>{
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

});

afterEach(
    async()=>{
        await PostModel.deleteMany();
    }
);

afterAll(
    async()=>{
        await mongoose.disconnect();
        await mongoServer.stop();
    }
);

const createToken = (payload={id:'12345', email:"test@example.com"})=>{
    return jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:'1h'});
}

//GET on /api/posts/all
describe('GET api/posts/all test', () => {
    test('should return all posts with valid token', async()=>{
        const token = createToken();
        const post1 = await PostModel.create({
            title:'Post 1',
            caption:'Caption1',
            imageUrl:'http://imageUrl.com/img1.jpg',
            createdBy:new mongoose.Types.ObjectId(),
        });

        const response = await request(app).get('/api/posts/all').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Post 1')
    });

    test('should return 401 is token is missing', async()=>{
        const res = await request(app).get('/api/posts/all');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    })

    test('should return 404 if no post found', async()=>{
        const token = createToken();
        const res = await request(app).get('/api/posts/all').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('No posts found')

    });
});

//GET on /api/posts/:id
describe('GET /api/posts/:id should retireve the post with postID', ()=>{
    test('should return 200 with the post', async()=>{
        const token = createToken();
        const post1 = await PostModel.create({
            title: 'Sample Post',
            caption: 'This is a sample caption',
            imageUrl: 'http://image.url/sample.jpg',
            createdBy: new mongoose.Types.ObjectId(),
        });
        const res = await request(app).get(`/api/posts/${post1._id}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'Sample Post');
        expect(res.body).toHaveProperty('caption', 'This is a sample caption');
        expect(res.body).toHaveProperty('imageUrl','http://image.url/sample.jpg');
    });

    test('should return 401 token is missing', async()=>{
        const fakeID = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/posts/${fakeID}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });
    test('Should return 404 object not found', async()=>{
        const token = createToken();
        const fakeID= new mongoose.Types.ObjectId();
        const post1 = await PostModel.create({
            title: 'Sample Post',
            caption: 'This is a sample caption',
            imageUrl: 'http://image.url/sample.jpg',
            createdBy: new mongoose.Types.ObjectId(),
        });
        const res = await request(app).get(`/api/posts/${fakeID}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Post not found')
    });
});

//POST on /api/posts/
describe('POST request on /api/posts/', ()=>{
    test('Should return 201 post created',async()=>{
        const token = createToken();
        const res = await request(app).post('/api/posts/').set('Authorization', `Bearer ${token}`).send({
            title: 'Sample Post',
            caption: 'This is a sample caption',
            imageUrl: 'http://image.url/sample.jpg',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Post created successfully');
        expect(res.body.post).toHaveProperty('title', 'Sample Post');
        expect(res.body.post).toHaveProperty('caption','This is a sample caption');
        expect(res.body.post).toHaveProperty('imageUrl','http://image.url/sample.jpg');
        // expect(res.body.post).toHaveProperty('createdBy');
    })

    test('Should return 401', async()=>{
        const res = await request(app).post('/api/posts/').send({
            title: 'Sample Post',
            caption: 'This is a sample caption',
            imageUrl: 'http://image.url/sample.jpg',
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('When expected inputs are not provided, Should return 422', async()=>{
        const token = createToken();
        const res = await request(app)
        .post('/api/posts/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            caption:"No inageUrl and title",
        });
        console.log(res);
        expect(res.statusCode).toBe(422);
        expect(res.body.errors).toBe('Need title of post');
    });
})


// PUT /api/posts/:id
describe('PUT request on /api/posts/:id', ()=>{
    let token
    beforeAll(()=>{
        token = createToken();
    })

    test('Should return 200', async()=>{
        const createRes = await request(app).post('/api/posts/').set('Authorization', `Bearer ${token}`).send({
            title:"Original title",
            caption:"Original caption",
            imageUrl:"http://image.url/original.jpg"
        });
        const createdPost = createRes.body.post;
        console.log("Value of createdPost:\n",createdPost);
        const res = await request(app)
        .put(`/api/posts/${createdPost._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title:"updated title"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post updated successfully");
        expect(res.body.post).toHaveProperty('title', 'updated title');
    });

    test('Should give 404 post Not Found',async()=>{
        const token= createToken();
        const fakeID=new mongoose.Types.ObjectId();
        const res = await request(app).put(`/api/posts/${fakeID}`).set('Authorization', `Bearer ${token}`).send({
            title:"updated title"
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Post not found");
    })
});

//DELETE /api/posts/:id

describe('DELETE /api/posts/:id',()=>{
    let token
    beforeAll(()=>{
        token = createToken();
    });
    test("DELETE 200", async()=>{
        const createRes = await request(app).post(`/api/posts/`).set('Authorization', `Bearer ${token}`).send({
            title:"Original title",
            caption:"Original caption",
            imageUrl:"http://image.url/original.jpg"
        });
        const createdPost = createRes.body.post;

        const res = await request(app).delete(`/api/posts/${createdPost._id}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post deleted successfully");
    });
    test('DELETE 404 post not found', async()=>{
        const fakeID = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/posts/${fakeID}`).set('Authorization', `Bearer ${token}`);
        console.log("Value of res.body.message",res.body.message);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(`message`,`Post not found`);
    })
})