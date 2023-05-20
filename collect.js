const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const axios = require("axios");

// Twitch API configuration
const clientSecret = "";
const clientId = "";
const channelName = "everythingnowshow";

// Function to retrieve VODs for a channel
async function getChannelVODs() {
  try {
    console.log("Retrieving VODs for channel", channelName);
    // Request app access token
    const appAccessToken = await getAppAccessToken();
    console.log("App access token:", appAccessToken);
    // Get Twitch channel ID
    const channel = await axios.get(
      `https://api.twitch.tv/helix/users?login=${channelName}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${appAccessToken}`,
        },
      }
    );
    console.log("Channel ID:", channel.data.data[0].id);
    const channelId = channel.data.data[0].id;

    // Get VODs for the channel
    const vods = await axios.get(
      `https://api.twitch.tv/helix/videos?user_id=${channelId}&first=100`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${appAccessToken}`,
        },
      }
    );

    // Process VODs
    const vodList = vods.data.data;

    // Filter VODs for the current year
    const currentYear = new Date().getFullYear();
    const vodsThisYear = vodList.filter((vod) => {
      const vodYear = new Date(vod.created_at).getFullYear();
      return vodYear === currentYear;
    });

    const data = JSON.parse(fs.readFileSync("data.json"));

    // Sort VODs by CreatedAt property
    const sortedVODs = vodsThisYear.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    console.log("VODs:", sortedVODs);

    // Process each VOD ID
    for (const vod of sortedVODs) {
      const result = await downloadChatData(vod.id);
      if (result) {
        data.push(result);
      }
    }

    // Save the updated data to data.json
    fs.writeFileSync("data.json", JSON.stringify(data));

    console.log("Chat data saved to data.json");
  } catch (error) {
    console.error("Error retrieving VODs:", error);
  }
}

// Function to get the app access token
async function getAppAccessToken() {
  try {
    // Request the app access token
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token`,
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        },
      }
    );

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error getting app access token:", error.response.data);
    throw error;
  }
}

// Function to download chat data for a VOD ID
async function downloadChatData(vodId) {
  try {
    console.log("Downloading chat data for VOD ID", vodId);
    const command = `./TwitchDownloaderCLI chatdownload -o ${vodId}.json -u ${vodId}`;
    await exec(command);

    // Read the chat data from the file
    const chatData = JSON.parse(fs.readFileSync(`${vodId}.json`));

    // Delete the file after reading the data
    fs.unlinkSync(`${vodId}.json`);

    // Return the chat data
    return chatData;
  } catch (error) {
    console.error(`Error downloading chat data for VOD ID ${vodId}:`, error);
    return null;
  }
}

// Call the function to retrieve VODs and download chat data
getChannelVODs();
