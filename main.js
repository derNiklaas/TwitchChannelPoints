const twitchWebSocket = new WebSocket("wss://pubsub-edge.twitch.tv");
const rconWebSocket = new WebSocket("ws://localhost:25576");

const listenerObject = {
    "type": "LISTEN",
    "nonce": "UwU",
    "data": {
        "topics": ["channel-points-channel-v1.124355754"],
        "auth_token": "AUTH TOKEN HERE"
    }
};

const pingObject = {
    "type": "PING"
};

twitchWebSocket.addEventListener('open', (open) => {
    console.log("logged in?");
    twitchWebSocket.send(JSON.stringify(listenerObject));
    ping();
});

twitchWebSocket.addEventListener('message', (message) => {
    let json = JSON.parse(message.data);
    if (json.type === "PONG") {
        console.log("Connection is okay!");
        return;
    }
    if (json.type === "MESSAGE") {
        json = JSON.parse(json.data.message);
        json = json.data.redemption;
        const username = json.user.display_name;
        const reward = json.reward.title;
        const message = json.user_input;
        onReward(reward, username, message);
    }
});

/**
 * Pings the Twitch API every 4 minutes (to ensure that the connection is still running)
 */
function ping() {
    twitchWebSocket.send(JSON.stringify(pingObject));
    setTimeout(ping, 4 * 60 * 1000);
}

/**
 * This method is going to be called when someone uses a custom reward.
 *
 * @param reward The name of the reward.
 * @param username The display name of the user.
 * @param message (Optional) The message that the user enters.
 */
function onReward(reward, username, message) {

    if (reward === "Text to Speech (DE)") {
        message = message.replace(/🎍 🎍/g, "🎍 ");
        textToSpeech("de-DE", username + " sagt " + message);
    } else if (reward === "Text to Speech (EN)") {
        message = message.replace(/🎍 🎍/g, "🎍 ");
        textToSpeech("en-US", username + " says " + message);
    } else if (reward === "[Minecraft] Regen + Nacht") {
        rconWebSocket.send("weather rain");
        rconWebSocket.send("time set 18000");
    } else if (reward === "[Minecraft] Tier spawnen") {
        let animal = "";
        const random = Math.floor(Math.random() * 4);
        if (random === 0) {
            animal = "Cow";
        } else if (random === 1) {
            animal = "Sheep";
        } else if (random === 2) {
            animal = "Pig";
        } else {
            animal = "Chicken";
        }
        rconWebSocket.send("summon " + animal + " -992 65 -962 {CustomName:§c" + username + "}");
    }

    if (message) {
        console.log(username + " used " + reward + " Message: " + message);
    } else {
        console.log(username + " used " + reward);
    }
}

function textToSpeech(lang, text) {
    const msg = new SpeechSynthesisUtterance();
    msg.lang = lang;
    msg.text = text;
    msg.rate = 0.7;
    msg.volume = 0.7;
    speechSynthesis.speak(msg);
}
