"use client";
import { useEffect, useState } from "react";
import BigNumber from "./BigNumber";
import Leaderboard from "./Leaderboard";
import { Data, Comment } from "./types";
import styles from "./Dashboard.module.css";
import VersusNumber from "./Versus";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const top10ChattersByMessageCount = (chatData: Comment[] | undefined) => {
  let chatterCount = {};

  if (chatData === undefined) {
    return [];
  }
  chatData.forEach((comment) => {
    let chatterName = comment.commenter.display_name;

    if (chatterName !== "StreamElements") {
      //@ts-ignore
      chatterCount[chatterName] = (chatterCount[chatterName] || 0) + 1;
    }
  });
  let sortedChatters = Object.keys(chatterCount)
    //@ts-ignore
    .map((name) => ({ name, count: chatterCount[name] }))
    .sort((a, b) => b.count - a.count);
  return sortedChatters.slice(0, 10);
};

const numberOfUniqueChatters = (chatData: Comment[] | undefined) => {
  let chatterCount = {};

  if (chatData === undefined) {
    return 0;
  }
  chatData.forEach((comment) => {
    let chatterName = comment.commenter.display_name;

    if (chatterName !== "StreamElements") {
      //@ts-ignore
      chatterCount[chatterName] = (chatterCount[chatterName] || 0) + 1;
    }
  });
  return Object.keys(chatterCount).length;
};

const numberOfMessages = (chatData: Comment[] | undefined) => {
  if (chatData === undefined) {
    return 0;
  }
  return chatData.length;
};

const top5Emotes = (chatData: Comment[] | undefined) => {
  let emoteCount = {};

  if (chatData === undefined) {
    return [];
  }
  chatData.forEach((comment) => {
    let emotes = comment.message.emoticons;

    if (emotes !== undefined) {
      emotes.forEach((emote) => {
        //@ts-ignore
        emoteCount[emote._id] = (emoteCount[emote._id] || 0) + 1;
      });
    }
  });
  let sortedEmotes = Object.keys(emoteCount)
    //@ts-ignore
    .map((name) => ({ name, count: emoteCount[name] }))
    .sort((a, b) => b.count - a.count);
  return sortedEmotes.slice(0, 5);
};

const wordFrequencyByWord = (chatData: Comment[] | undefined, word: string) => {
  let wordCount = {};

  if (chatData === undefined) {
    return 0;
  }
  chatData.forEach((comment) => {
    let words = comment.message.body.split(" ");

    words.forEach((word) => {
      //@ts-ignore
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });
  //@ts-ignore
  return wordCount[word];
};

const wordFrequency = (chatData: Comment[] | undefined) => {
  let wordCount = {};

  // list of common words to ignore
  const stopWords = [
    "the",
    "or",
    "can",
    "you",
    "and",
    "a",
    "to",
    "is",
    "in",
    "it",
    "i",
    "of",
    "for",
    "on",
    "with",
    "at",
    "by",
    "an",
    "this",
    "that",
    "from",
    "up",
    "be",
    "as",
    "are",
    "get",
    "have",
    "just",
    "our",
    "we",
    "catjam",
  ];

  let emoticonNames = new Set();

  if (chatData === undefined) {
    return [];
  }

  // gather all emoticon names
  chatData.forEach((comment) => {
    comment.message.fragments.forEach((fragment) => {
      if (fragment.emoticon) {
        emoticonNames.add(fragment.text);
      }
    });
  });

  chatData.forEach((comment) => {
    // ignore words from StreamElements
    if (comment.commenter.display_name === "StreamElements") {
      return;
    }

    // split message body into words
    let words = comment.message.body.split(" ");

    // count occurrences of each word
    words.forEach((word) => {
      // ignore common words and emoticon names
      if (!stopWords.includes(word.toLowerCase()) && !emoticonNames.has(word)) {
        //@ts-ignore
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
  });

  // convert word counts into desired format
  let wordArray = Object.keys(wordCount)
    //@ts-ignore
    .map((word) => ({ text: word, value: wordCount[word] }))
    .sort((a, b) => b.value - a.value);

  return wordArray;
};

const averageChatsPerMinute = (chatData: Comment[] | undefined) => {
  if (chatData === undefined) {
    return 0;
  }
  let firstMessage = chatData[0];
  let lastMessage = chatData[chatData.length - 1];

  let firstMessageTime = new Date(firstMessage.created_at);
  let lastMessageTime = new Date(lastMessage.created_at);

  // add 10 minutes to the first message time to account for the stream starting
  firstMessageTime.setMinutes(firstMessageTime.getMinutes() + 25);

  let timeDifference = lastMessageTime.getTime() - firstMessageTime.getTime();

  let minutes = timeDifference / 1000 / 60;

  return chatData.length / minutes;
};

const leaderboardDataForTimesCertainNamesMentioned = (
  chatData: Comment[] | undefined,
  names: string[]
) => {
  let nameCount = {};

  if (chatData === undefined) {
    return [];
  }
  chatData.forEach((comment) => {
    let words = comment.message.body.split(" ");

    words.forEach((word) => {
      if (names.includes(word.toLowerCase())) {
        //@ts-ignore
        nameCount[word.toLowerCase()] =
          //@ts-ignore
          (nameCount[word.toLowerCase()] || 0) + 1;
      }
    });
  });
  let sortedNames = Object.keys(nameCount)
    //@ts-ignore
    .map((name) => ({ name, count: nameCount[name] }))
    .sort((a, b) => b.count - a.count);
  return sortedNames;
};

const Dashboard = () => {
  const [data, setData] = useState<Data[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Data | null>(null);
  const first10Vods = data.slice(0, 9).reverse();
  const [loading, setLoading] = useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  // Function to process your data
  const processData = (data: any) => {
    let result = [];
    let count = {};
    data.forEach((item: any) => {
      item.comments.forEach((comment: any) => {
        if (comment.commenter.display_name !== "StreamElements") {
          //@ts-ignore
          if (count[comment.commenter.display_name]) {
            //@ts-ignore
            count[comment.commenter.display_name].count += 1;
          } else {
            //@ts-ignore
            count[comment.commenter.display_name] = {
              name: comment.commenter.display_name,
              logo: comment.commenter.logo,
              count: 1,
            };
          }
        }
      });
    });
    for (let key in count) {
      //@ts-ignore
      result.push(count[key]);
    }
    return result.sort((a, b) => b.count - a.count).slice(0, 5);
  };

  const renderCustomAxisTick = ({
    x,
    y,
    index,
  }: {
    x: number;
    y: number;
    index: number;
  }) => {
    const payload = processedData[index]; // assuming processedData is in scope and each item has a logo property
    console.log("Payload: " + JSON.stringify(payload));
    return (
      <svg x={x - 12} y={y}>
        <foreignObject x="0" y="0" width="24" height="24">
          <img src={payload.logo} alt={payload.name} width="24" height="24" />
        </foreignObject>
      </svg>
    );
  };

  // Custom label
  const renderCustomBarLabel = ({
    x,
    y,
    width,
    height,
    value,
    index,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    index: number;
  }) => {
    const payload = processedData[index]; // assuming processedData is in scope
    console.log("AHHHH" + JSON.stringify(payload));
    return (
      <text
        x={x + width / 2}
        y={y}
        textAnchor="middle"
        dy={-6}
        fontSize={18}
        fill={"#ffd000"}
        stroke={"none"}
      >
        {payload.name}
      </text>
    );
  };
  let processedData = processData(data);
  /*
  {
  vodID: "123",
  totalChatMessages: 123,
  date: "2021-01-01",
  }
  */
  const vodChatMessages = first10Vods.map((vod) => {
    return {
      vodID: vod.video.id,
      totalChatMessages: vod.comments.length,
      date: new Date(vod.video.created_at).toLocaleDateString(),
    };
  });

  useEffect(() => {
    console.log("fetching data");
    fetch("./data.json")
      .then((response) => response.json())
      .then((myData: Data[]) => {
        setData(myData);
        setSelectedVideo(myData[0]);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setIsLoadingComplete(true);
        }, 10000);
      });
  }, []);

  const handleVideoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = event.target.value;
    const selected = data.find((d: any) => d.video.id === selectedTitle);
    setSelectedVideo(selected || null);
  };

  return (
    <div>
      <div>
        {loading && !isLoadingComplete ? (
          <div
            className={`${
              isLoadingComplete ? styles["loading-complete"] : styles.loading
            }`}
            aria-hidden={isLoadingComplete}
          >
            <h1>Loading...</h1>
          </div>
        ) : (
          <div>
            <select
              style={{
                width: "100%",
              }}
              onChange={handleVideoChange}
            >
              {data.map((d: any) => {
                console.log(first10Vods);
                return (
                  <option key={d.video.id} value={d.video.id}>
                    {d.video.created_at + " - " + d.video.title}
                  </option>
                );
              })}
            </select>
            <div className={styles.gridc}>
              {selectedVideo && (
                <>
                  <Leaderboard
                    className="leaderboard"
                    players={top10ChattersByMessageCount(
                      selectedVideo.comments
                    ).map((chatter, index) => ({
                      rank: index + 1,
                      name: chatter.name,
                      score: chatter.count,
                    }))}
                    title="Top 10 Chatters"
                  />
                  <BigNumber
                    className="bigNumber"
                    title="Unique Chatters"
                    number={numberOfUniqueChatters(selectedVideo.comments)}
                  />
                  <BigNumber
                    className="bigNumber"
                    title="Total Messages"
                    number={numberOfMessages(selectedVideo.comments)}
                  />
                  <Leaderboard
                    className="leaderboard"
                    players={top5Emotes(selectedVideo.comments).map(
                      (emote, index) => ({
                        rank: index + 1,
                        name: emote.name,
                        score: emote.count,
                        imageUrl: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.name}/default/dark/1.0`,
                      })
                    )}
                    title="Top 5 Emotes"
                  />

                  <VersusNumber
                    className="versus"
                    title="# of Votes"
                    titleOne="1"
                    titleTwo="2"
                    numberOne={`${wordFrequencyByWord(
                      selectedVideo.comments,
                      "1"
                    )}`}
                    numberTwo={`${wordFrequencyByWord(
                      selectedVideo.comments,
                      "2"
                    )}`}
                  />
                  <BigNumber
                    className="bigNumber"
                    title="Chats per Minute"
                    number={averageChatsPerMinute(
                      selectedVideo.comments
                    ).toFixed(2)}
                  />
                  <Leaderboard
                    className="leaderboard"
                    players={leaderboardDataForTimesCertainNamesMentioned(
                      selectedVideo.comments,
                      ["rocky", "jake", "grant", "chris", "gus"]
                    ).map((name, index) => ({
                      rank: index + 1,
                      name: name.name,
                      score: name.count,
                    }))}
                    title="Cast Mentions"
                  />
                </>
              )}
            </div>
            <div className={styles.chartContainer}>
              <h2 className={styles.chartHeading}>Chats Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart width={1000} height={400} data={vodChatMessages}>
                  <Line
                    type="monotone"
                    dataKey="totalChatMessages"
                    stroke="#FFC203"
                  />
                  <XAxis dataKey="date" stroke="#ffd000" />
                  <YAxis stroke="#ffd000" />
                  <Tooltip
                    contentStyle={{
                      color: "white",
                      backgroundColor: "black",
                      stroke: "yellow",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <h2 className={styles.chartHeading}>Chats In Last 10 Episodes</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                  width={1000}
                  height={600}
                  data={processedData}
                >
                  <XAxis
                    stroke="#ffd000"
                    dataKey="name"
                    tick={renderCustomAxisTick}
                  />
                  <YAxis stroke="#ffd000" />
                  <Bar
                    dataKey="count"
                    barSize={30}
                    fill="#ffd000"
                    stroke="#ffd000"
                    label={renderCustomBarLabel}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      );
    </div>
  );
};

export default Dashboard;
