import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import YouTube, { YouTubeProps } from 'react-youtube';
import '../../app/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface IHash {
  [key: string]: any;
}

function YouTubePlayer({ playerRef, videoID, onPlayStateChange }: { playerRef: React.MutableRefObject<any>, videoID: string, onPlayStateChange: (isPlaying: boolean) => void }) {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      onPlayStateChange(true);
    } else {
      onPlayStateChange(false);
    }
  };

  const opts: YouTubeProps['opts'] = {
    height: '500',
    width: '840',
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      mute: 1,
      showinfo: 0,
    },
  };

  return (
    <YouTube videoId={videoID} opts={opts} onReady={onPlayerReady} onStateChange={onPlayerStateChange} />
  );
}

function VideoPage() {
  const router = useRouter();
  const handleBackButtonClick = () => {
    router.back();
  };

  const { videoid } = router.query;
  const playerRef = useRef<any>(null);
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [selectedBoundingBox, setSelectedBoundingBox] = useState<any>(null);
  const [selectedBoundingBoxLabel, setSelectedBoundingBoxLabel] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
    if (isPlaying) {
      const interval = setInterval(() => {
        updateBoundingBox();
      }, 100); // Adjust interval as needed
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentFrameIndex]);

  const updateBoundingBox = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    const selectedData = fetchedData[currentFrameIndex];
    if (!selectedData) return;

    const currentFrame = selectedData.frames.find((frame: any) => frame.timestamp_offset <= currentTime && currentTime < frame.timestamp_offset + 1);
    if (!currentFrame) return;

    setSelectedBoundingBox(currentFrame.normalized_bounding_box);
    setSelectedBoundingBoxLabel(selectedData.description);
  };

  const jumpToTime = (timestampOffset: number, index: number, frameNum: number) => {
    try {
      if (playerRef.current) {
        playerRef.current.seekTo(timestampOffset);
        playerRef.current.playVideo();
        setCurrentFrameIndex(frameNum);

        const selectedData = fetchedData[index];
        const selectedFrame = selectedData.frames[frameNum];
        setSelectedBoundingBox(selectedFrame.normalized_bounding_box);
        setSelectedBoundingBoxLabel(selectedData.description);
      }
    } catch {
      console.log("too fast")
    }
  };

  const renderBoundingBoxes = () => {
    if (!selectedBoundingBox) return null;
    const playerElement = playerRef.current.getIframe();
    if (!playerElement) return null;
    const videoWidth = playerElement.offsetWidth;
    const videoHeight = playerElement.offsetHeight;
    const { left, top, right, bottom } = selectedBoundingBox;
    const iframeOffsetLeft = playerElement.getBoundingClientRect().left;
    const iframeOffsetTop = playerElement.getBoundingClientRect().top;
    const boxStyle = {
      position: 'absolute',
      left: `${iframeOffsetLeft + left * videoWidth}px`,
      top: `${iframeOffsetTop + top * videoHeight}px`,
      width: `${(right - left) * videoWidth}px`,
      height: `${(bottom - top) * videoHeight}px`,
      border: '2px solid red',
    };

    const labelStyle = {
      position: 'absolute',
      left: `${iframeOffsetLeft + left * videoWidth}px`,
      top: `${iframeOffsetTop + top * videoHeight - 32}px`,
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
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded flex items-center transition-colors hover:bg-blue-600 hover:text-gray-100"
        onClick={handleBackButtonClick}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        <span>Back</span>
      </button>

      <div className="flex justify-center p-3">
        <YouTubePlayer playerRef={playerRef} videoID={videoid as string} onPlayStateChange={setIsPlaying} />
        {currentFrameIndex !== -1 && playerRef.current && renderBoundingBoxes()}
      </div>
      <div className="flex flex-col mt-4 mr-4">
        {fetchedData.map((data, index) => (
          data && data.description && (
            <div className="flex flex-wrap mt-4" key={index}>
              <div className="mb-4 pl-4 mr-4">{data.description}</div>
              {data.frames.map((frame, frameIndex) => (
                <div
                  key={frameIndex}
                  onMouseEnter={() => jumpToTime(frame.timestamp_offset, index, frameIndex)}
                  onMouseLeave={() => {
                    setSelectedBoundingBox(null);
                    setSelectedBoundingBoxLabel(null);
                  }}
                  className={`flex items-center justify-center bg-orange-500 text-white cursor-pointer hover:bg-orange-600 flex-grow ${frameIndex === 0 ? 'rounded-l-lg' : ''} ${frameIndex === data.frames.length - 1 ? 'rounded-r-lg' : ''}`}
                />
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default VideoPage;
