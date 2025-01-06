import PromptSuggestionButton from "./PromptSuggestionButtion"

const PromptSuggestions = ({onPromptClick}) => {
    const prompts = [
        "Explain DRS in F1.",
        "Tell me about Max Verstappen's career.",
        "Who is the highest paid F1 driver?",
        "Who will be the newest driver for Ferrari?",
    ]
    return (
        // map out messages
        <div className = "prompt-suggestion-row">
            
            {prompts.map((prompt, index) => <PromptSuggestionButton key={`suggestion-${index}`} text = {prompt} onClick = {() => onPromptClick(prompt)}/>)}
        </div>
    )
}

export default PromptSuggestions