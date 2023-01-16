import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
function Chatroom() {
let [message, setMessage] = useState("");

    return (
        <article className="app-main-article">

            <div className="view-messages"></div>
            <div className="new-message">
                <input type="text"
                placeholder="Message"
                value={message} 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(event.target.value)}
             
                
                />
            </div>
        </article>
    )
        
    
}

export default Chatroom;