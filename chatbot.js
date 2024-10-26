let history = [];

marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
});

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function appendMessage(message, ...classNames) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add(...classNames);
    messageContainer.innerHTML = marked.parse(message);
    document.getElementById('chatMessages').appendChild(messageContainer);
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage(message, 'user-message');
    userInput.value = '';
    userInput.style.height = 'auto';
    appendMessage('...', 'bot-message', 'loading');

    fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, history: history }),
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.loading').remove();
        appendMessage(data.message, 'bot-message');
        history = data.history;
    })
    .catch(err => {
        document.querySelector('.loading').remove();
        appendMessage('Error, please try again.', 'bot-message');
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
