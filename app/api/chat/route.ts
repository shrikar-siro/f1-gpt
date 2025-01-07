import { createOpenAI, openai} from '@ai-sdk/openai';
import {streamText } from 'ai'
import { DataAPIClient } from '@datastax/astra-db-ts';


import dotenv from 'dotenv'
dotenv.config();

const {ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPEN_AI_APIKEY
 } = process.env

//  console.log(`OpenAI API Key: ${OPEN_AI_APIKEY}`);
//  console.log(`Namespace: ${ASTRA_DB_NAMESPACE}`);
//  console.log(`Collection: ${ASTRA_DB_COLLECTION}`);
//  console.log(`Token: ${ASTRA_DB_APPLICATION_TOKEN}`);
//  console.log(`Endpoint: ${ASTRA_DB_API_ENDPOINT}`);

 const OpenAI = createOpenAI({apiKey: OPEN_AI_APIKEY})

 const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

 const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

 export async function  POST(req: Request){
    try{
        const {messages} = await req.json();
        const latestMessage = messages[messages?.length - 1]?.content;

        let docContext = "";
        const embedding = await openai.embedding.apply({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        });
        console.log(embedding);
        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION);
            //trying to find something similar to the latest message provided.
            const cursor = collection.find(null, {
                sort: {
                    //in the database, the embeddings 
                    $vector: embedding.data[0].embedding
                }, 
                limit: 10
            })

            //documents is the 10 similar pieces of information
            const documents = await cursor.toArray();
            const docsMap = documents?.map(doc => doc.text)
            docContext = JSON.stringify(docsMap)
        }catch(err){
            console.log("Error querying database.");
            docContext = ""
        }

        const template = {
            role: "system",
            content: `You are an AI assistant who knows everything about Formula One.
            Use the below context to augment what you know about Formula One Racing. The context
            will provide you with the most recent page data from wikipedia, the official F1 Website, and other
            sources. If the context doesn't include the information you need, answer based on your existing 
            knowledge and don't mention the source of your information or what the context does or doesn't include. 
            Format responses using markdown where applicable and don't return images.
            --------------------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            --------------------------
            QUESTION: ${latestMessage}
            --------------------------
            `
        }
        const result = await streamText({
            model: openai('gpt-4-turbo'),
            messages: [template,...messages]
        })

        return result.toDataStreamResponse();

        // const response = new Response(JSON.stringify(result), {
        //     status: 200,
        //     headers: {'Content-Type':'application/json'}
        // });

        // //since response is already a stream, the return should work.
        // return new StreamTextResult;

        
        
    } catch(err){
        throw err
    }
}