document.addEventListener("DOMContentLoaded", function () {
    const BOT_IMG = document.body.getAttribute('data-bot-img');
    const PERSON_IMG = document.body.getAttribute('data-person-img');

    const msgerForm = get(".msger-inputarea");
    const msgerInput = get(".msger-input");
    const msgerChat = get(".msger-chat");


    // Icons made by Freepik from www.flaticon.com
    const BOT_NAME = "Kiki";
    const PERSON_NAME = "Ihre Eingabe";

    let pendingDots = 0;
    let pendingInterval = null;


    msgerForm.addEventListener("submit", event => {
        event.preventDefault();

        const msgText = msgerInput.value;
        if (!msgText) return;

        appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
        msgerInput.value = "";
        botResponse(msgText);
    });


    function appendMessage(name, img, side, text, id = null) {
        text = text.replace(/\n/g, '<br>');

        const msgHTML = `
        <div class="msg ${side}-msg"${id ? ` id="${id}"` : ''}>
          <div class="msg-img" style="background-image: url(${img})"></div>
          <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-name">${name}</div>
              <div class="msg-info-time">${formatDate(new Date())}</div>
            </div>
            <div class="msg-text">${text}</div>
          </div>
        </div>`;

        msgerChat.insertAdjacentHTML("beforeend", msgHTML);
        msgerChat.scrollTop += 500;
    }


    function botResponse(rawText) {
        pendingDots = 0;
        appendMessage(BOT_NAME, BOT_IMG, "left", getPendingText(), "pending-indicator");  // Show loading
        pendingInterval = setInterval(function () {
            document.getElementById('pending-indicator').children[1].children[1].innerHTML = getPendingText();
        }, 500);

        // Bot Response
        $.get("/get_bot_1", { msg: rawText }).done(function (data) {
            clearInterval(pendingInterval);
            $("#pending-indicator").remove();  // Hide loading
            const msgText = data;
            appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
        });
    }


    // Utils

    function getPendingText() {
        pendingDots = (pendingDots + 1) % 4;
        return 'Output pending' + '.'.repeat(pendingDots);
    }

    function get(selector, root = document) {
        return root.querySelector(selector);
    }

    function formatDate(date) {
        const h = "0" + date.getHours();
        const m = "0" + date.getMinutes();
        return `${h.slice(-2)}:${m.slice(-2)}`;
    }
});