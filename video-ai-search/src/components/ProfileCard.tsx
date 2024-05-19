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
    width: '542',
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

  const { roleTag, videoID } = props;
  //sort out data strcuure
  // console.log(roleTag[0].entity)
  return (
    <div className="profile__card rounded-[15px] shadow-lg" style={{ width: '542px' }}>
      <YouTubePlayer playerRef={playerRef} isPlaying={isPlaying} videoID={videoID} />
      <div className=" no-highlight info-container d-flex flex-column bg-gradient-to-b from-gray-100 to-gray-200 justify-content-end bg-white align-items-end rounded-b-xl p-3 shadow-lg" style={{ height: '163px' }}>
        <h2 className="pb-9">
          <div className="float-right">
            <Link href={`/video/[videoid]`} as={`/video/${videoID}`}>
              <button class=" bg-gradient-to-b    font-bold  from-green-400 to-green-500 hover:bg-green-500 rounded-md p-2 text-white transform transition-transform duration-200 ease-in-out hover:scale-105">
                🔎  Frames
              </button>
            </Link>
          </div>
        </h2>
        {roleTag.slice(0, 6).map((item) => (
          <p
            key={item.entity}
            className={`inline-block  hover:cursor-pointer mr-3 bg-gradient-to-b from-blue-400 to-blue-500 rounded-xl py-2 px-3  
            font-bold text-white mt-2 shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105 `}
            style={{ borderRadius: '15px' }} >
            {item.entity}
          </p>
        ))}
        {roleTag.length > 7 && (
          <span className="text-gray-600 text-xs">+{roleTag.length - 7} more</span>
        )}
      </div>
    </div>
  );
};