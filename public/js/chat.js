import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");

        }
    })
}
//END CLIENT_SEND_MESSAGE

//SERVER RETURN MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")
    const boxTyping = document.querySelector(".chat .inner-list-typing")

    const div = document.createElement("div");
    let htmlFullName = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullName = `<div class ="inner-name">${data.fullName}</div>`
        div.classList.add("inner-incoming");
    }
    div.innerHTML = `
        ${htmlFullName}
        <div class ="inner-content">${data.content}</div>
        `;

    body.insertBefore(div, boxTyping);

    bodyChat.scrollTop = bodyChat.scrollHeight;

})
//END SERVER RETURN MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}

//End Scroll Chat To Bottom


//SHOW ICON CHAT
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown');
    }
}

// Show Typing 
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000)

}

// End show typing


//Insert Icon to Input
var timeOut;

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;

        input.setSelectionRange(inputChat.value.length, inputChat.value.length);
        inputChat.focus();
        showTyping();
    })
}
//End Insert Icon to Input

// Input Keyup

inputChat.addEventListener("keyup", () => {

    showTyping();
})

//End Input Keyup

//END SHOW ICON CHAT

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
    socker.on("SERVER_RETURN_TYPING", (data) => {
        console.log(data);
        if (data.type == "show") {
            const bodyChat = elementListTyping.querySelector(".chat .inner-body")
            const existTyping = elementListTyping.querySelector(`[user-id] = "${data.userId}`)

            if (!existTyping) {
                const boxTyping = document.createElement("..");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML = `
                <div class="box-typing">
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;

                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        }
        else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id] = "${data.userId}`)
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    })
}
//END SERVER_RETURN_TYPING









