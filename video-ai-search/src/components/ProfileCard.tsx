import Image from 'next/image';
import YouTube, { YouTubeProps } from 'react-youtube';

// Import the profile interface from data.js
import { iProfile } from "../services/data";
import { useEffect, useRef, useState } from 'react';

function YouTubePlayer({ playerRef, isPlaying }: { playerRef: React.MutableRefObject<any>, isPlaying: boolean }) {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };
  const opts: YouTubeProps['opts'] = {
    height: '350',
    width: '540',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // Set autoplay to 0 to avoid starting all players
    },
  };

  return (
    <YouTube videoId="8tAB146sc38" opts={opts} onReady={onPlayerReady} />
  );
}

export const ProfileCard = (props: iProfile) => {
  const playerRef = useRef<{ seekTo: (arg0: number) => void }>(null);
  const jumpButtonId = `jumpButton-${props.username}`; // Example using username

  const [isPlaying, setIsPlaying] = useState(false); // Track player state

  useEffect(() => {
    const jumpButton = document.getElementById(jumpButtonId);

    if (jumpButton) {
      jumpButton.addEventListener('click', () => {
        if (playerRef.current) {
          playerRef.current.seekTo(10);
          setIsPlaying(true);
        }
      });
    }
  }, [playerRef, jumpButtonId]);

  const { name, email, username, role, photo } = props;
  const src = `${photo}`;

  return (
    <div className="profile__card rounded-[15px] border border-solid" style={{ width: '540px' }}>
      <button id={jumpButtonId}>Jump to 30 seconds</button>
      <YouTubePlayer playerRef={playerRef} isPlaying={isPlaying} />
      <div className=" bg-slate-300 p-3">
        <h2 className="">Name: {name}</h2>
        <p>Role: {role}</p>
        <p>Email: {email}</p>
        <p>follow @{username}</p>
      </div>
    </div>
  );
};