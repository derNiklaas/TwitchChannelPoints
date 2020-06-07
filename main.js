const twitchWebSocket = new WebSocket("wss://pubsub-edge.twitch.tv");
const rconWebSocket = new WebSocket("ws://localhost:25576");

const listenerObject = {
    "type": "LISTEN",
    "data": {
        "topics": ["channel-points-channel-v1.ID"], // Replace ID with your twitch Channel ID.
        "auth_token": "AUTH TOKEN HERE" // Replace AUTH TOKEN HERE with your oauth token.
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
async function onReward(reward, username, message) {
    if (reward === "Text to Speech (DE)") {
        message = message.replace(/🎍 🎍/g, "🎍 ");
        textToSpeech("de-DE", username + " sagt " + message);
    } else if (reward === "Text to Speech (EN)") {
        message = message.replace(/🎍 🎍/g, "🎍 ");
        textToSpeech("en-US", username + " says " + message);
    } else if (reward === "[Minecraft] Regen + Nacht") {
        rconWebSocket.send("weather rain");
        rconWebSocket.send("time set 18000");
        await sleep(50);
        rconWebSocket.send("say §6" + username + "§r lässt es §6regnen§r und hat die Zeit vorgespult.")
    } else if (reward === "[Minecraft] Regen") {
        rconWebSocket.send("weather rain");
        rconWebSocket.send("say §6" + username + "§r lässt es §6regnen§r.")
    } else if (reward === "[Minecraft] Tier spawnen") {
        let animal = ["Cow", "Sheep", "Pig", "Chicken"];
        const random = Math.floor(Math.random() * animal.length);
        let loc = await getLocation();
        await sleep(50);
        rconWebSocket.send("summon " + animal[random] + " " + loc[0] + " " + loc[1] + " " + loc[2] + " {CustomName:§c" + username + "}");
        rconWebSocket.send("say §6" + username + "§r hat ein zufälliges Tier erschaffen.")
    } else if (reward === "[Minecraft] Test") {
        let loc = await getLocation();
        console.log(loc);
    }
    if (message) {
        console.log(username + " used " + reward + " Message: " + message);
    } else {
        console.log(username + " used " + reward);
    }
}

/**
 * Say the specified language with an text to speech narrator in a given language.
 *
 * @param lang The language of the narrator
 * @param text The text that should be said.
 */
function textToSpeech(lang, text) {
    const msg = new SpeechSynthesisUtterance();
    msg.lang = lang;
    msg.text = text;
    msg.rate = 0.7;
    msg.volume = 0.7;
    speechSynthesis.speak(msg);
}

let tpData = undefined;

rconWebSocket.addEventListener('message', (message) => {
    if (message.data.startsWith("Teleported")) {
        let position = message.data.split("to ")[1];
        const x = Math.floor(position.split(",")[0]);
        const y = Math.floor(position.split(",")[1]);
        const z = Math.floor(position.split(",")[2]);
        tpData = [x, y, z];
    }
});

/**
 * Gets the location of the specified player (player has to be online)
 *
 * @param username The username of the player
 * @returns An array with the x, y, z coordinate of the player.
 */
async function getLocation(username) {
    tpData = undefined;
    rconWebSocket.send("tp " + username + " ~ ~ ~");

    while (!tpData) {
        await sleep(1);
    }
    return tpData;
}

/**
 * Just a sleep method.
 * @param ms the amount of milliseconds that the program should wait.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
