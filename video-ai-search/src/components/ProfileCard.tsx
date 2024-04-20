import Image from 'next/image';
import YouTube, { YouTubeProps } from 'react-youtube';

// Import the profile interface from data.js
import { iProfile } from "../services/data";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function YouTubePlayer({ playerRef, isPlaying, videoID }: { playerRef: React.MutableRefObject<any>, isPlaying: boolean, videoID: string }) {
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
    <YouTube videoId={videoID} opts={opts} onReady={onPlayerReady} />
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

  const { role, videoID } = props;
  //sort out data strcuure
  return (
    <div className="profile__card rounded-[15px] border border-solid" style={{ width: '542px' }}>
      <YouTubePlayer playerRef={playerRef} isPlaying={isPlaying} videoID={videoID} />
      <div className="info-container d-flex flex-column justify-content-end align-items-end bg-slate-300 p-3" style={{ height: '163px' }}>
        <h2 className="pb-4">VideoID: {videoID}
          <div className="float-right">
            <Link href={`/video/[videoid]`} as={`/video/${videoID}`}>
              <button className="bg-blue-100 hover:bg-blue-500 rounded-md p-2 text-blue-700">
                More Info
              </button>
            </Link>
          </div>
        </h2>
        <p>Labels: {role}</p>
      </div>
    </div>
  );
};