![ENS Dashboard](ens.png)

# Twitch Chat Analytics Dashboard

The ENS Dashboard is a web application that allows ENS viewers and cast to analyze chat data from Twitch VODs. By visualizing chat activity, top chatters, emote usage, and other metrics, this dashboard provides valuable insights into the engagement and dynamics of Twitch chat.

## Features

The Twitch Chat Analytics Dashboard offers the following features:

- **Top 10 Chatters:** Displays the top 10 users who have sent the most chat messages, excluding StreamElements.

- **Unique Chatters:** Shows the number of unique chatters in the analyzed chat data.

- **Total Messages:** Presents the total number of chat messages in the analyzed data.

- **Top 5 Emotes:** Highlights the top 5 most frequently used emotes in the chat.

- **Word Frequency:** Provides insights into the frequency of specific words used in the chat.

- **Average Chats per Minute:** Calculates the average number of chats per minute in the analyzed chat data.

- **Cast Mentions:** Shows the leaderboard of the most mentioned cast members' names in the chat.

- **Chats Over Time:** Visualizes the chat activity over time using a line chart.

- **Chats in Last 10 Episodes:** Displays a bar chart showing the chat activity for the last 10 episodes.

## Technologies Used

The Twitch Chat Analytics Dashboard is built using the following technologies:

- **TypeScript**: A typed superset of JavaScript that brings static typing to the language. TypeScript enhances code quality, autocompletion, and provides better documentation.

- **React**: A popular JavaScript library for building user interfaces. React provides a component-based architecture that enables efficient and reusable UI components.

- **Recharts**: A powerful charting library for React. Recharts offers various chart types and customizable options to create visually appealing and interactive charts.

## Usage

1. Clone the repository
2. Install dependencies: `npm install`
3. Add your Twitch API credentials (client secret and client ID) to the appropriate variables in the code.
4. Run the application: `npm start`
5. Access the dashboard in your browser at `http://localhost:3000`

## Future Enhancements

The ENS Dashboard is an evolving project, and there are several potential areas for future enhancements, including:

- Real-time Chat Analytics
- Sentiment Analysis
- Interactive Chat Analysis
- User Authentication
- Exporting Analytics
