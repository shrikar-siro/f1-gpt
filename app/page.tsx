"use client"
import Image from "next/image"
import f1gptlogo from './assets/f1gptlogo.png'

//useChat (from vercel) creates conversational user interface
//for chatbot application.
import {useChat} from "ai/react"

import {Message} from "ai"

//we export this constant which contains our HTML.
const Home = () => {
    return (
        <main>

            {/* next component imported from earlier. */}
            <Image src = {f1gptlogo} width = "250" alt = {"F1GPT Logo"}/>
        </main>
    )
}

export default Home