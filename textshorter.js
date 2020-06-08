function emoji_spam_protec(text) {
    // const emoji_spam_detector = /(:\w*:\s*)+/; // We don't get the emojis with `:`, that would be too ez
    let emoji_spam_detector = new RegExp('(\\p{Emoji}\\s*)+', 'ug'); // UTF-8 encoded Emojis
    let match;
    let emoji_count = 0; // Count Doku :P

    let replace_mes = [];
    let replace_emoji = [];
    while ((match = emoji_spam_detector.exec(text)) !== null) {
        console.log(`Emoji spam '${match[0]}' found!`);
        replace_mes[emoji_count] = match[0];
        replace_emoji[emoji_count] = match[1];
        emoji_count++;
    }

    // Cannot replace while matching, so I have to do it here
    for (let i = 0; i < emoji_count; i++) {
        text = text.replace(replace_mes[i], replace_emoji[i]);
    }

    if (emoji_count >= 1) {
        text += " emoji-spam smh";
    }
    return text;
}