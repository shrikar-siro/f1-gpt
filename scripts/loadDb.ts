import {DataAPIClient} from "@datastax/astra-db-ts";
//helps with scraping data.
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";

//split large pieces of data into smaller chunks for LLMs to easily search/understand them.
import {RecursiveCharacterTextSplitter} from  "langchain/text_splitter";

import "dotenv/config";


