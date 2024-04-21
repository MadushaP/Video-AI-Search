import React from 'react';
import { useRouter } from 'next/router';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useEffect, useRef, useState } from 'react';
import '../../app/globals.css';

function YouTubePlayer({ playerRef, isPlaying, videoID }: { playerRef: React.MutableRefObject<any>, isPlaying: boolean, videoID: string }) {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };
  const opts: YouTubeProps['opts'] = {
    height: '500',
    width: '840',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // Set autoplay to 0 to avoid starting all players
      controls:0,
      rel: 0,
    },
  };

  return (
    <YouTube videoId={videoID} opts={opts} onReady={onPlayerReady} />
  );
}

function VideoPage() {
  const router = useRouter();
  const { videoid } = router.query; // Destructure videoId from query object
  const playerRef = useRef<{ seekTo: (arg0: number) => void }>(null);

  const [isPlaying, setIsPlaying] = useState(false); // Track player state

  return (
    <div className="flex justify-center h-screen p-3">
      <YouTubePlayer playerRef={playerRef} isPlaying={isPlaying} videoID={videoid} />
    </div>
  );
}



export default VideoPage;
