//destructuring message object (from handlePrompt earlier).
const Bubble = ({message}) => {
    const {content, role} = message;
    return (
        <div className = {`${role} bubble`}>
            {/* show content in the bubble. */}
            {content}
        </div>
    )
}

export default Bubble