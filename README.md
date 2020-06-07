# TwitchPointStuff

# How to install
1. Download the project. You can clone the repository via git or download a .zip file from [here](https://github.com/derNiklaas/TwitchPointStuff/archive/master.zip).
2. Open the ``main.js`` file and change the ID part from ``channel-points-channel-v1.ID`` (line 8) to your channel ID and ``AUTH TOKEN HERE`` (line 9) to your oauth token. This oauth token needs the ``channel:read:redemptions`` permission in order to get the channel point events. You can generate a token using [this website](https://twitchapps.com/tokengen/#). In order to use that website you have to create a twitch application, which can be created [here](https://dev.twitch.tv/console/apps/create).

# How to use this application
You can simply open thee ``index.html`` file in your browser and it should connect to the twitch servers.

NOTE: The default main.js file is my point rewards file. If you want to include your rewards, you have to change the ´`onReward`` function and test for your reward names.
