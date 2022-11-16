const socket = io();

const renderMessages = async (messages) => {
    const res = await fetch("./views/chatTemplate.ejs");
    const template = await res.text();
    const html = ejs.render(template, { messages });
    document.getElementById("chatLog").innerHTML = html;
}


document.getElementById("messageCenter")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        const chatBox = e.target.querySelector("[name='message']");
        const emailInput = e.target.querySelector("[name='email']");
        if (chatBox.value.trim()) {
            const message = chatBox.value;
            const email = emailInput.value;
            const obj = {
                author: {
                    email: email
                },
                text: message
            }
            socket.emit("client:newMessage", obj);
            chatBox.value = "";
            chatBox.focus();
            emailInput.disabled = true;
        }
    })

//Evento websocket del chat (render de cada mensaje nuevo).
socket.on("server:messages", (data) => {
    renderMessages(data.messages);
})