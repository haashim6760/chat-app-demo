import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";



function Chatroom() {
let [message, setMessage] = useState("");
let {firestore} = useFirebase();
let messageRef = collection(firestore!, `message-chat`);

const sendNewMessage =async (e: {preventDefault: () => void}) => {
    e.preventDefault()
    addDoc(messageRef, {
       messages : message
    })

}

    return (
        <article className="app-main-article">

            <div className="view-messages"></div>
            <form className="new-message" onSubmit={sendNewMessage}>
            <div className="new-message">
                <input type="text"
                placeholder="Message"
                value={message} 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(event.target.value)}
                />
            
            <button className="send-button" type="submit">
                Send
            </button>
            </div>
            </form>
        </article>
    )
        
    
}

export default Chatroom;