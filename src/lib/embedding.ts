import {AutoProcessor,AutoTokenizer,CLIPTextModelWithProjection,CLIPVisionModelWithProjection, PreTrainedTokenizer} from '@xenova/transformers';

class Embedding {
    private model: CLIPVisionModelWithProjection |null = null;
    private tokenizer: PreTrainedTokenizer | null = null;
    private textModel: CLIPTextModelWithProjection | null = null; 
    private imageProcessor: AutoProcessor | null = null;

    constructor() {
        this.initializeModels();
    }

    private async initializeModels() {
        const model_id = process.env.MODEL_ID;
        console.log(`start initialize model ${model_id}`);
        
        this.model = await CLIPVisionModelWithProjection.from_pretrained(model_id as string);
        this.tokenizer = await AutoTokenizer.from_pretrained(model_id as string);
        this.textModel = await CLIPTextModelWithProjection.from_pretrained(model_id as string);
        this.imageProcessor = await AutoProcessor.from_pretrained(model_id as string);

        console.log(`end initialize model ${model_id}`);
    }

    async getTextEmbedding(text: string): Promise<number[]> {
        if (this.tokenizer === null || this.textModel === null) {
            throw new Error('Model not initialized');
        }
        const textInputs = await this.tokenizer(text, { padding: true, truncation: true });
        const { text_embeds } = await this.textModel(textInputs);
        return Array.from(text_embeds.data);
    }
}

export { Embedding };