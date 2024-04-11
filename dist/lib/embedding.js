var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AutoProcessor, RawImage, AutoTokenizer, CLIPTextModelWithProjection, CLIPVisionModelWithProjection } from '@xenova/transformers';
class Embedding {
    constructor() {
        this.model = null;
        this.tokenizer = null;
        this.textModel = null;
        this.imageProcessor = null;
        this.initializeModels();
    }
    initializeModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const model_id = process.env.MODEL_ID;
            console.log(`start initialize model ${model_id}`);
            this.model = yield CLIPVisionModelWithProjection.from_pretrained(model_id);
            this.tokenizer = yield AutoTokenizer.from_pretrained(model_id);
            this.textModel = yield CLIPTextModelWithProjection.from_pretrained(model_id);
            this.imageProcessor = yield AutoProcessor.from_pretrained(model_id);
            console.log(`end initialize model ${model_id}`);
        });
    }
    getTextEmbedding(text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tokenizer === null || this.textModel === null) {
                throw new Error('Model not initialized');
            }
            const textInputs = yield this.tokenizer(text, { padding: true, truncation: true });
            const { text_embeds } = yield this.textModel(textInputs);
            return Array.from(text_embeds.data);
        });
    }
    getImageEmbedding(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.imageProcessor || !this.model) {
                throw new Error('Model not initialized');
            }
            const image = yield RawImage.read(url);
            const inputs = yield this.imageProcessor(image);
            const embeds = yield this.model(inputs);
            return Array.from(embeds.image_embeds.data);
        });
    }
}
export { Embedding };
