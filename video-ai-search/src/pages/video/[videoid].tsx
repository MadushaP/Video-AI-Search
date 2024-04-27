import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import YouTube, { YouTubeProps } from 'react-youtube';
import '../../app/globals.css';

function YouTubePlayer({ playerRef, videoID }: { playerRef: React.MutableRefObject<any>, isPlaying: boolean, videoID: string }) {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };
  const opts: YouTubeProps['opts'] = {
    height: '500',
    width: '840',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      mute:1,
      showinfo: 0,
    },
  };

  return (
    <YouTube videoId={videoID} opts={opts} onReady={onPlayerReady} />
  );
}

function VideoPage() {
  const router = useRouter();
  const { videoid } = router.query;
  const playerRef = useRef<any>(null);
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [selectedBoundingBox, setSelectedBoundingBox] = useState<any>(null); // State to store the selected bounding box
  const [selectedBoundingBoxLabel, setSelectedBoundingBoxLabel] = useState<any>(null); // State to store the selected bounding box


  useEffect(() => {
    const importJsonFiles = async () => {
      try {
        if (videoid) {
          const file = await import(`../../../../video-intelligence-api/object_analysis_results/${videoid}.json`);
          setFetchedData(file.default);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    importJsonFiles();
  }, [videoid]);

  useEffect(() => {
    const handlePlayerStateChange = (event: any) => {
      if (event.data === 1) { // If player state is playing
        const interval = setInterval(() => {
          const currentTime = playerRef.current.getCurrentTime();
          const frameIndex = fetchedData.findIndex((data) => {
            const timestamps = data.frames.map((frame: any) => frame.timestamp_offset);
            return timestamps.includes(currentTime);
          });
          setCurrentFrameIndex(frameIndex);
        }, 1000); // Update frame every second
        return () => clearInterval(interval);
      }
    };

    if (playerRef.current) {
      playerRef.current.addEventListener('onStateChange', handlePlayerStateChange);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.removeEventListener('onStateChange', handlePlayerStateChange);
      }
    };
  }, [fetchedData]);

  const jumpToTime = (timestampOffset: number, index: number, frameNum: number) => {
    try {
      if (playerRef.current) {
        playerRef.current.seekTo(timestampOffset);
        // Play the video
        playerRef.current.playVideo();

        // Set the selected bounding box data
        const selectedData = fetchedData[index];
        const selectedFrame = selectedData.frames[frameNum];

        setSelectedBoundingBox(selectedFrame.normalized_bounding_box);
        setSelectedBoundingBoxLabel(selectedData.description);

        // Update the current frame index
        setCurrentFrameIndex(frameNum);
      }
    } catch {
      console.log("too fast")
    }
  };

  const renderBoundingBoxes = () => {
    if (!selectedBoundingBox) return null; // Check if a bounding box is selected
  
    const playerElement = playerRef.current.getIframe();
    if (!playerElement) return null;
  
    const videoWidth = playerElement.offsetWidth;
    const videoHeight = playerElement.offsetHeight;
  
    const { left, top, right, bottom } = selectedBoundingBox;
  
    // Get the position of the iframe within its parent container
    const iframeOffsetLeft = playerElement.getBoundingClientRect().left;
    const iframeOffsetTop = playerElement.getBoundingClientRect().top;
  
    const boxStyle = {
      position: 'absolute',
      left: `${iframeOffsetLeft + left * videoWidth}px`, // Include the offset of the iframe
      top: `${iframeOffsetTop + top * videoHeight}px`, // Include the offset of the iframe
      width: `${(right - left) * videoWidth}px`,
      height: `${(bottom - top) * videoHeight}px`,
      border: '2px solid red',
    };
  
    // Calculate the position of the label
    const labelStyle = {
      position: 'absolute',
      left: `${iframeOffsetLeft + left * videoWidth}px`, // Include the offset of the iframe
      top: `${iframeOffsetTop + top * videoHeight - 32}px`, // Position the label above the bounding box (adjust the value as needed)
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '4px',
      borderRadius: '4px',
    };
  
    return (
      <div>
        <div style={boxStyle} />
        <div style={labelStyle}>{selectedBoundingBoxLabel}</div>
      </div>
    );
  };
  return (
    <div className="h-screen relative">
      <div className="flex justify-center p-3">
        <YouTubePlayer playerRef={playerRef} isPlaying={false} videoID={videoid as string} />
        {currentFrameIndex !== -1 && playerRef.current && renderBoundingBoxes()}
      </div>
      <div className="flex flex-col mt-4 mr-4">
        {fetchedData.map((data, index) => (
          data && data.description && (
            <div className="flex flex-wrap mt-4" key={index}>
              <div className="mb-4 pl-4 mr-4">{data.description}</div>
              {data.frames.map((frame, frameIndex) => (
                <div key={frameIndex} onMouseEnter={() => jumpToTime(frame.timestamp_offset, index, frameIndex)}

                  className="flex items-center justify-center bg-orange-500 text-white cursor-pointer hover:bg-orange-600 flex-grow" />
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default VideoPage;