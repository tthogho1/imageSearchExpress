import { RecordMetadata } from '@pinecone-database/pinecone';

export type Photo = {
    id: string;
    score?: number;
    created_at: string;
    width: number;
    height: number;
    description: string;
    urls: {
        small: string;
    };
    links: {
        html: string;
    };
};

export type PhotoSearchResponse = {
    total: number;
    total_pages: number;
    results: Photo[];
};

export type WebCamSearchResponse = {
    namespace: string,
    matches: webCamObj[]
}

export type  webCamObj = {
    id: number| string;
    metadata?: webCamMetadata | undefined,
    score?: number | undefined,
    sparseValues: number[] | undefined,
    values: number[]|undefined
};

export type webCamMetadata = {
    country:string,
    day:string,
    images:string,
    latitude:number,
    longitude:number,
    status:string,
    title:string,
    webcamid:number,
}