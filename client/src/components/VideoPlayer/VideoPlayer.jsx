import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./VideoPlayer.css";

//importing icons
import playIconWhite from "../../assets/icons/play(white).png";
import pauseIconWhite from "../../assets/icons/pause(white).png";
import volumeIconWhite from "../../assets/icons/volume(white).png";
import muteIconWhite from "../../assets/icons/mute(white).png";
import miniPlayerIconWhite from "../../assets/icons/miniPlayer(white).png";
import rectangleIconWhite from "../../assets/icons/rectangle(white).png";
import fullscreenIconWhite from "../../assets/icons/fullscreen(white).png";

const VideoPlayer = ({
  updatedPlaylist,
  isPlaying,
  setIsPlaying,
  isSearchFocused,
  isCreatePlaylistFocused,
  activeIndex,
  setActiveIndex,
  suffle,
  loop,
  playNextSong,
  playPreviousSong,
  setVideoSizeInMB,
  isMiniPlayer,
  setIsMiniPlayer,
  isCinemaMode,
  setIsCinemaMode,
}) => {
  const videoRef = useRef(null);
  const timelineRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  //play speed functionality
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen state

  useEffect(() => {
    const file = updatedPlaylist[activeIndex];
    if (!file) return;
    console.log("name of song before sending", file);
    axios
      .post("http://localhost:3000/api/v1/videos/file-size", {
        file,
      })
      .then((res) => {
        console.log("file size ---", res.data);
        setVideoSizeInMB(res.data);
      });
  }, [updatedPlaylist, activeIndex]);

  // Toggle Play/Pause
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrentTime(video.currentTime);

    // Update timeline and thumb positions
    const progress = (video.currentTime / video.duration) * 100;
    timelineRef.current.style.width = `${progress}%`;
  };

  // Handle video loading to get duration
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setDuration(video.duration);
  };

  // Seek the video when clicking on the timeline
  const handleTimelineClick = (event) => {
    const timeline = event.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left; // Click position relative to the timeline
    const clickTime = (clickPosition / rect.width) * duration; // Calculate the new time
    videoRef.current.currentTime = clickTime; // Update video current time
  };

  // Handle volume change
  const handleVolumeChange = (event) => {
    const video = videoRef.current;
    video.volume = event.target.value;
    setVolume(event.target.value);
  };

  const onEnded = () => {
    if (videoRef.current && loop == 2) {
      videoRef.current.currentTime = 0; // Restart video from the beginning
      videoRef.current.play(); // Play the video again
    } else {
      playNextSong();
    }
  };

  const seekForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10; // Seek forward 10 seconds
    }
  };

  const seekBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10; // Seek backward 10 seconds
    }
  };

  /******************** video mode functionalities ********************/

  // Toggle mini-player mode
  const toggleMiniPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
  };

  // Toggle cinema mode on and off
  const toggleCinemaMode = () => {
    setIsCinemaMode(!isCinemaMode);
  };

  // Function to toggle fullscreen
  const toggleFullscreen = (e) => {
    e.preventDefault();
    const videoElement = videoRef.current;
    if (!isFullscreen) {
      // Enter fullscreen
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        // For Firefox
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        // For Chrome, Safari, and Opera
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        // For Internet Explorer/Edge
        videoElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const changePlaybackSpeed = () => {
    if (!videoRef.current) return;
    if (playbackSpeed >= 2) {
      setPlaybackSpeed(0.5);
    } else {
      setPlaybackSpeed((prevSpeed) => prevSpeed + 0.5);
    }
    videoRef.current.playbackRate = playbackSpeed;
  };

  const increaseVolume = () => {
    setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1));
  };
  const decreaseVolume = () => {
    setVolume((prevVolume) => Math.max(0, prevVolume - 0.1));
  };

  useEffect(() => {
    videoRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Optional: Automatically switch to mini-player when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const videoElement = videoRef.current;
      if (window.scrollY > videoElement.offsetTop + videoElement.offsetHeight) {
        setIsMiniPlayer(true);
      } else {
        setIsMiniPlayer(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      togglePlayPause();
      return;
    }
    if (isSearchFocused) return;
    if (isCreatePlaylistFocused) return;
    switch (event.key.toLowerCase()) {
      case "arrowup":
        increaseVolume();

        break;
      case "arrowdown":
        decreaseVolume();
        break;

      case "arrowleft":
        seekBackward();
        break;

      case "arrowright":
        seekForward();
        // Add your logic here for Right arrow key press
        break;

      case " ":
        console.log("space pressed");
        event.preventDefault();
        togglePlayPause();
        break;

      case "i":
        toggleMiniPlayer();
        break;

      case "f":
        toggleFullscreen(event);
        break;
      case "t":
        toggleCinemaMode();
        break;

      default:
        break;
    }
  };

  // Use effect to set up and clean up the event listener
  useEffect(() => {
    // Add event listener on mount
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isPlaying,
    volume,
    isSearchFocused,
    isCreatePlaylistFocused,
    toggleFullscreen,
    toggleMiniPlayer,
    toggleCinemaMode,
  ]); // Empty dependency array ensures this effect runs only on mount and unmount

  useEffect(() => {
    if (!videoRef) return;
    videoRef.current.play();
    setIsPlaying(true);
  }, [activeIndex]);

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  function formatDuration(time) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
      return `${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
    } else {
      return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
    }
  }

  return (
    <div
      className={`video-container ${isMiniPlayer ? "mini-player" : isCinemaMode ? "cinema-mode" : ""}`}
    >
      {/* Cinema mode background overlay */}
      {isCinemaMode && <div className="cinema-overlay"></div>}
      <video
        src={`http://localhost:8080/` + updatedPlaylist[activeIndex]}
        className=""
        ref={videoRef}
        width="600"
        onClick={togglePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        // style={{ maxWidth: "100%" }}
      />
      <div className="video-controls-container">
        <div className="timeline-container" onClick={handleTimelineClick}>
          <div className="timeline" ref={timelineRef}></div>
        </div>
        <div className="controls">
          <img
            src={isPlaying ? pauseIconWhite : playIconWhite}
            onClick={togglePlayPause}
            alt="play-button"
            className="buttonImg play-pause-btn"
          />
          <div className="volume-container">
            <img
              src={volume == 0 ? muteIconWhite : volumeIconWhite}
              alt="volume-button"
              className="buttonImg volume-btn"
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
          <div className="duration-container">
            <div className="current-time">{formatDuration(currentTime)}</div>/
            <div className="total-time">{formatDuration(duration)}</div>
          </div>
          <div
            className="speed-btn buttonImg wide"
            onClick={changePlaybackSpeed}
          >
            {playbackSpeed + "x"}
          </div>
          <img
            src={miniPlayerIconWhite}
            onClick={toggleMiniPlayer}
            alt="miniPlayer-btn"
            className="buttonImg miniplayer-btn mini-player"
          />
          <img
            src={rectangleIconWhite}
            onClick={toggleCinemaMode}
            alt="theater-btn"
            className="buttonImg theater-btn"
          />
          <img
            src={fullscreenIconWhite}
            onClick={toggleFullscreen}
            alt="fullscreen-btn"
            className="buttonImg fullscreen-btn"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
