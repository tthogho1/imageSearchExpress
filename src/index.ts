import express from 'express'
import { Embedding } from './lib/embedding.js';
import { Pinecone , QueryResponse, FetchResponse ,RecordMetadata } from '@pinecone-database/pinecone';
import type { webCamMetadata } from './lib/type.ts';
import type { Photo } from './lib/type.ts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config();

const app: express.Express = express()
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ??  '',
});
const index = pinecone.index(process.env.PINECONE_INDEX_NAME ?? '');
const image_server = process.env.WINDY_IMAGE_SERVER ?? '';

// CORSの許可
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(express.static( __dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const embedding = new Embedding() 

// GetとPostのルーティング
const router: express.Router = express.Router()
router.post('/api/searchWebcam', async (req:express.Request, res:express.Response) => {
    const query = req.body.query as string;

    console.log("query: " + query);
    const y = await embedding.getTextEmbedding(query);
    const response = await index.namespace('webcamInfo').query({
        topK: 5,
        vector: y,
        includeValues: false,
        includeMetadata: true
    });
    
    const { matches } = response;
    const photos = matches.map(match => {
        const metadata = match.metadata as webCamMetadata;
        const photo : Photo = {
            id: match.id,
            score: match.score,
            created_at: "",
            width: 200,
            height: 112,
            description: metadata.title,
            urls: {
                small: image_server + match.id + ".jpg",
            },
            links: {
                html: metadata.day,
            }
        }
        return photo;
    })
    res.send(photos);
})

app.use(router)
app.listen(3000,()=>{ console.log('Example app listening on port 3000!') })
