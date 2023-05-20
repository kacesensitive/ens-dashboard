const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const axios = require("axios");

const clientSecret = "";
const clientId = "";
const channelName = "everythingnowshow";

async function getChannelVODs() {
  try {
    console.log("Retrieving VODs for channel", channelName);

    const appAccessToken = await getAppAccessToken();
    console.log("App access token:", appAccessToken);

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

    const vods = await axios.get(
      `https://api.twitch.tv/helix/videos?user_id=${channelId}&first=100`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${appAccessToken}`,
        },
      }
    );

    const vodList = vods.data.data;

    const currentYear = new Date().getFullYear();
    const vodsThisYear = vodList.filter((vod) => {
      const vodYear = new Date(vod.created_at).getFullYear();
      return vodYear === currentYear;
    });

    const data = JSON.parse(fs.readFileSync("data.json"));

    const sortedVODs = vodsThisYear.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    console.log("VODs:", sortedVODs);

    for (const vod of sortedVODs) {
      const result = await downloadChatData(vod.id);
      if (result) {
        data.push(result);
      }
    }

    fs.writeFileSync("data.json", JSON.stringify(data));

    console.log("Chat data saved to data.json");
  } catch (error) {
    console.error("Error retrieving VODs:", error);
  }
}

async function getAppAccessToken() {
  try {
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

async function downloadChatData(vodId) {
  try {
    console.log("Downloading chat data for VOD ID", vodId);
    const command = `./TwitchDownloaderCLI chatdownload -o ${vodId}.json -u ${vodId}`;
    await exec(command);

    const chatData = JSON.parse(fs.readFileSync(`${vodId}.json`));

    fs.unlinkSync(`${vodId}.json`);

    return chatData;
  } catch (error) {
    console.error(`Error downloading chat data for VOD ID ${vodId}:`, error);
    return null;
  }
}

getChannelVODs();
