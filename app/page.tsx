"use client"
import Image from "next/image"
import f1gptlogo from "./assets/f1gptlogo.png"


//useChat (from vercel) creates conversational user interface
//for chatbot application.
import {useChat} from "ai/react"


// import {Message} from "ai"


//we export this constant which contains our HTML.
const Home = () => {
   const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat();
   const noMessages = true;
   return (
       <main>


           {/* next component imported from earlier. */}
           <Image src = {f1gptlogo} width = "450" alt = {"F1GPT Logo"}/>


           {/* styling section based on if there are messages or not. */}
           <section className= {noMessages ? "" : "populated"}>
               {/*if noMessages, is true, show something. Otherwise, show something else*/}


               {noMessages ? (
                   <>
                       <p className="starter-text">The ultimate place for F1 super fans! Ask F1 GPT anything about F1 and it will present the most up-to-date answers. Enjoy!</p>
                       <br />
                       {/*show sample questions (if user can't think of anything*/}
                       {/* <PromptSuggestions /> */}
                   </>
               ):(
                   <>
                       {/* map messages onto text bubbles. */}
                       {/* <LoadingBubble /> */}
                   </>
               )}
           </section>
           {/* the handleInputChange, handleSubmit, input come from useChat. We don't define them. */}
           <form onSubmit={handleSubmit}>
                   <input className = "question-box" onChange={handleInputChange} value = {input} placeholder="Ask me something..."/>
                   <input type = "submit"/>
               </form>
       </main>
   )
}


export default Home
