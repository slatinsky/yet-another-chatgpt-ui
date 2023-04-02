export function scrollDown() {
    const messages = document.querySelector("#messages-container");
    if (messages) {
        messages.scrollTop = messages.scrollHeight;
    }
}