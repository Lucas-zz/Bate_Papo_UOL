let lastMessage;
let username;

function toggleMenu() {
    const menu = document.querySelector(".menu");
    const hidden = document.querySelector(".asideMenu");

    menu.classList.toggle("noDisplay");
    hidden.classList.toggle("noDisplay")
}

function toggleCheck(check) {

}

function scrollLastMessage() {
    const ulMessages = document.querySelector(".messages-container");
    const liLastMessage = ulMessages.lastElementChild;

    if (lastMessage !== liLastMessage) {
        liLastMessage.scrollIntoView();
        lastMessage = liLastMessage;
    }
}

function Message(data) {
    let messageClass = '';
    let receiver = '';

    if (data.type === 'status') {
        messageClass = 'enterChat';
    }

    if (data.type === 'private_message') {
        if (data.to !== username &&
            data.to !== data.to !== "Todos" &&
            data.from !== username) {
            return "";
        }

        messageClass = "privateMessage";
        receiver = `<span> para </span>
        <strong>${data.to}: </strong>`;
    }

    if (data.type === 'message') {
        messageClass = "normalMessage";
        receiver = `<span class="receiver"> para<strong>${data.to}: </strong></span>`
    }

    return `
        <li class="${messageClass}" data-identifier="message">
            <span class="time">(${data.time})</span>
            <span class="sender"><strong>${data.from}</strong></span>
            ${receiver}
            <span class="message">${data.text}</span>
        </li>
    `;
}

function loadMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    promise.then((response) => {
        const messages = response.data;

        const ulMessages = document.querySelector(".messages-container");
        ulMessages.innerHTML = '';

        for (let i = 0; i < messages.length; i++) {
            ulMessages.innerHTML += Message(messages[i]);
        }

        scrollLastMessage();
    });
}

function askName() {
    username = prompt("Qual o seu nome?");

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {
        name: username
    });

    promise.then(() => {
        setInterval(() => {
            axios.get("https://mock-api.driven.com.br/api/v4/uol/status", {
                name: username
            });
        }, 4800);
    });

    promise.catch(() => {
        alert("Nome Indisponível");
        askName();
    });
}

function startApp() {
    loadMessages();
    setInterval(loadMessages, 3000);

    askName();

    const inputMessage = document.querySelector(".sendMessage");
    inputMessage.onkeydown = (e) => {
        if (e.code === 'Enter') {
            sendMessage();
        }
    };
}

function sendMessage() {
    const inputMessage = document.querySelector(".sendMessage");

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
        from: username,
        to: "Todos",
        text: inputMessage.value,
        type: "message",
    });

    inputMessage.value = "";

    promise.then(loadMessages);

    promise.catch(() => {
        window.location.reload();
    });
}

startApp();