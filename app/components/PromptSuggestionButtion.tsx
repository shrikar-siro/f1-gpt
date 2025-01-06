const PromptSuggestionButton = ({text, onClick}) =>{
    return (
        <button 
            className = "prompt-sugggestion-button"
            onClick = {onClick}>

                {/* passed in text. */}
            {text}
        </button>
    )
}

export default PromptSuggestionButton;