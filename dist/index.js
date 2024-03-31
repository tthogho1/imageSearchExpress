var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
import express from 'express';
import { Embedding } from './lib/embedding.js';
import { Pinecone } from '@pinecone-database/pinecone';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const pinecone = new Pinecone({
    apiKey: (_a = process.env.PINECONE_API_KEY) !== null && _a !== void 0 ? _a : '',
});
const index = pinecone.index((_b = process.env.PINECONE_INDEX_NAME) !== null && _b !== void 0 ? _b : '');
const image_server = (_c = process.env.WINDY_IMAGE_SERVER) !== null && _c !== void 0 ? _c : '';
// CORSの許可
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const embedding = new Embedding();
// GetとPostのルーティング
const router = express.Router();
router.post('/api/searchWebcam', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.body.query;
    const y = yield embedding.getTextEmbedding(query);
    const response = yield index.namespace('webcamInfo').query({
        topK: 5,
        vector: y,
        includeValues: false,
        includeMetadata: true
    });
    const { matches } = response;
    const photos = matches.map(match => {
        const metadata = match.metadata;
        const photo = {
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
        };
        return photo;
    });
    res.send(photos);
}));
app.use(router);
app.listen(3000, () => { console.log('Example app listening on port 3000!'); });
