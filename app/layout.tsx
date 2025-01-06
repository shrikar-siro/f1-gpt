import "./global.css"

export const metadata = {
    title: "F1GPT",
    description: "Find all you need to know about F1 here!"
}


//any children connected to the root (all screen elements, etc.)
//will output to screen like so.


const RootLayout = ({children}) => {
    return (
        <html lang = "en">
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout