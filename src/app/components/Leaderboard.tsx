import React from "react";
import Image from "next/image";
import styles from "./Leaderboard.module.css";

type Player = {
  rank: number;
  name: string;
  score: number;
  imageUrl?: string;
};

interface LeaderboardProps {
  players: Player[];
  className?: string;
  title: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  title,
  className,
}) => (
  <div className={`${styles.container} ${className}`}>
    <h2 className={styles.title}>{title}</h2>
    <table className={styles.leaderboard}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.rank}>
            <td className={styles.rank}>{player.rank}</td>
            <td className={styles.name}>
              {player.imageUrl ? (
                <Image
                  src={player.imageUrl}
                  alt={player.name}
                  width={30}
                  height={30}
                />
              ) : (
                player.name
              )}
            </td>
            <td className={styles.score}>{player.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Leaderboard;
