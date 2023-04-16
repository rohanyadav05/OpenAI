import React from 'react';
import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'

import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'
const API_KEY="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";
const systemMessage={"role":"system",
                      "content":"Explain like a developer",
                    }




const Bot = () => {
    const[messages,setMessages]=useState([
        {
            message: "Hello, I am here to help you",

            setTime:"just now",
            sender: "ChatGPT"
        }
    ]);
    const[isTyping,setIsTyping]=useState(false);

    const handleSend=async(message)=>{
        const newMessage={
            message,direction:"outgoing",
            sender:"user"
        };
        const newMessages=[...messages,newMessage];
        setMessages(newMessages)
    }

    async function processMessageToChatGPT(chatMessages){
        let apiMessages=chatMessages.map((messageObject)=>{
            let role="";
            if(messageObject.sender==="ChatGPT"){
                role="assistant";

            }
            else{
                role="user";
            }
            return{role:role, content:messageObject.message}
        });
        const apiRequestBody={
            "model":"gpt-3.5-turbo",
            "message":[ systemMessage, ...apiMessages]
        }
        await fetch ("https://api.openai.com/v1/chat/completions",{
            method:"POST",
            headers:{
                "Authorization": "Bearer"+API_KEY,
                "content-type": "application/json"
            },
            body:JSON.stringify(apiRequestBody)
        }).then((data)=>{
            return data.json();
        }).then((data)=>{
            setMessages([...chatMessages,{
                message:data.chices[0].message.content,
                sender:"ChatGPT"
            }]);
            setIsTyping(false);
        })
    }
    return (
    
    <div className='app'>
        <div style={{position:"relative", height:"600px", width:"700px"}}>
            <MainContainer>
                <ChatContainer>
                    <MessageList ScrollBehavior="smooth" TypingIndicator={isTyping? 
                    <TypingIndicator content="Typing..."/>:null}>
                        {messages.map((message,i)=>{
                            return <Message key={i} model={message}/>
                        })}
                    </MessageList>
                    <MessageInput placeholder="Type here" onSend={handleSend}/>
                </ChatContainer>

            </MainContainer>

        </div>
    </div>
    )  
}



export default Bot;