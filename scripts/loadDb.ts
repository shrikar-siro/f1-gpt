import {DataAPIClient} from "@datastax/astra-db-ts";
//helps with scraping data.
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";

//split large pieces of data into smaller chunks for LLMs to easily search/understand them.
import {RecursiveCharacterTextSplitter} from  "langchain/text_splitter";

import "dotenv/config";

//used to compute similarity between 2 vectors
//dot product - dotting two vectors together
//cosine - finding cosine between vectors
//euclidean - calculating euclidean distance
type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

//connect to astra database.

const {ASTRA_DB_NAMESPACE, 
       ASTRA_DB_COLLECTION, 
       ASTRA_DB_API_ENDPOINT, 
       ASTRA_DB_APPLICATION_TOKEN, 
       OPEN_AI_APIKEY
    } = process.env

//connect to openAI
//all openAI properties/methods are attached to constant.

const openai = new OpenAI({apiKey: OPEN_AI_APIKEY})


//data from outside sources.

const f1Data = [
    'https://en.wikipedia.org/wiki/Formula_One',
    'https://www.skysports.com/f1/news/12433/13283152/lewis-hamilton-positive-and-hungry-by-ferrari-move-for-2025-formula-1-season',
    'https://www.formula1.com/en/latest/all',
    'https://en.wikipedia.org/wiki/List_of_female_Formula_One_drivers',
    'https://en.wikipedia.org/wiki/2024_Formula_One_World_Championship',
    'https://www.fia.com/news/new-era-competition-fia-showcases-future-focused-formula-1-regulations-2026-and-beyond',
    'https://www.formula1.com/en/results/2024/races',
    'https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions',
    'https://www.autosport.com/f1/news/history-of-female-f1-drivers-including-grand-pr/',
    'https://www.espn.com/racing/story/_/id/40365662/more-battery-less-aero-how-2026-regulations-affect-f1',
    'https://www.formula1.com/en/latest/article/fia-unveils-formula-1-regulations-for-2026-and-beyond-featuring-more-agile.75qJiYOHXgeJqsVQtDr2UB',
    'https://www.formula1.com/en/latest/article/explained-2026-aerodynamic-regulations-fia-x-mode-z-mode-.26c1CtOzCmN3GfLMywrgb2'

];

//connect to database using client.

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

//set typescript scrictness to false to mute type safety.
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,

    //# characters in each chunk
    chunkOverlap: 100
});

//create collection for database.

const createCollection = async(SimilarityMetric: SimilarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {

            //found on openStax documentation and openAI documentation
            dimension: 1536,
            metric: SimilarityMetric
        }
    })
}

//loading sample data.
const loadSampleData = async() => {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    for await(const url of f1Data){

        //scrapePage scrapes every individual URL in our collection.
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);

        //for every chunk, create embedding and turn chunk into vector.

        for await (const chunk of chunks){

            //the embedding is a JSONObject which we get the "data" component out of later.
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk, 
                encoding_format: "float"
            })

            const vector = embedding.data[0].embedding;

            const res = await collection.insertOne({
                $vector: vector, 
                text: chunk
            })

            console.log(res)
        }
    }
}

//scrape data
const scrapePage = async(url: string) => {
    //use puppeteer
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            //once document is loaded, start scraping/evaluating.
            waitUntil: "domcontentloaded"
        },
        evaluate: async(page, browser) =>{
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })

    //stripping out HTML tags.
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())


