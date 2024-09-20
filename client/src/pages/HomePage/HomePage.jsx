import { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer.jsx";
import Songs from "../../components/Songs/Songs.jsx";
import Details from "../../components/Details/Details.jsx";
import "./HomePage.css";

const Home = ({ setNavbarVisiblity, isSearchFocused, navbarData }) => {
  setNavbarVisiblity(true);

  console.log(navbarData);
  const [allSongs, setAllSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState([]);

  // State to keep track of the active item/song
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [suffle, setSuffle] = useState(false);
  const [loop, setLoop] = useState(0);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Initialize the state for playlists with the default selected option
  const [playlists, setPlaylists] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState("All Songs");
  const [updatedPlaylist, setUpdatedPlaylist] = useState([]);

  const [isCreatePlaylistFocused, setIsCreatePlaylistFocused] = useState(false);

  //storing video details like size in mb
  const [videoSizeInMB, setVideoSizeInMB] = useState();

  useEffect(() => {
    console.log("---------useEffect Home Page Hook");
    setPlaylists([]);

    //axios request to get all videos
    axios.get("http://localhost:3000/api/v1/videos/all-videos").then((res) => {
      console.log(res.data);
      setAllSongs(res.data);
    });

    //axios request to get all playlist names
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3000/api/v1/playlists/all-playlists")
      .then((response) => {
        console.log(response.data);
        // console.log(response.data[0].name);
        const data = response.data;
        setPlaylists(data);
      })
      .catch((err) => console.log(err));
  }, [isCreatePlaylistFocused]);

  useEffect(() => {
    if (activePlaylist === "All Songs") {
      setPlaylistSongs(allSongs);
      return;
    }
    console.log("-----get playlist songs-----");

    //axios request to get songs of a particular playlist
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/api/v1/playlists/get-playlist-songs", {
        activePlaylist,
      })
      .then((res) => {
        console.log(activePlaylist + " songs : ", res.data[0].songs);
        setUpdatedPlaylist(res.data[0].songs);
        setPlaylistSongs(res.data[0].songs);
      });
  }, [allSongs, activePlaylist]);

  useEffect(() => {
    const filteredSongs = allSongs.filter((song) =>
      song.toLowerCase().includes(navbarData.toLowerCase()),
    );
    if (navbarData && filteredSongs.length <= 0) {
      setUpdatedPlaylist([]);
    } else if (navbarData && filteredSongs.length >= 0) {
      setUpdatedPlaylist(filteredSongs);
    } else {
      setUpdatedPlaylist(playlistSongs);
    }
  }, [navbarData, allSongs, playlistSongs]);

  console.log(allSongs[0]);
  console.log("active index : ", activeIndex);

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const playNextSong = () => {
    if (suffle) {
      const randomIndex = getRandomNumber(0, updatedPlaylist.length);
      setActiveIndex(randomIndex);
    } else {
      if (activeIndex >= updatedPlaylist.length - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex((prevActiveIndex) => prevActiveIndex + 1);
      }
    }
  };

  const playPreviousSong = () => {
    console.log("active index 1 : ", activeIndex);
    if (suffle) {
      const randomIndex = getRandomNumber(0, updatedPlaylist.length);
      setActiveIndex(randomIndex);
    } else {
      if (activeIndex <= 0) {
        const lastIndex = updatedPlaylist.length - 1;
        setActiveIndex(lastIndex);
      } else {
        setActiveIndex((prevActiveIndex) => prevActiveIndex - 1);
      }
    }
  };

  const handleLoop = () => {
    if (loop == 0) {
      setLoop(1);
    } else if (loop == 1) {
      setLoop(2);
    } else {
      setLoop(0);
    }
  };

  // Use effect to set up and clean up the event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isSearchFocused) return;
      if (isCreatePlaylistFocused) return;
      switch (event.key.toLowerCase()) {
        case "s":
          // event.preventDefault();
          setSuffle(!suffle);
          break;

        case "n":
          event.preventDefault();
          playNextSong();
          break;

        case "p":
          event.preventDefault();
          playPreviousSong();
          break;

        case "l":
          handleLoop();
          break;

        default:
          break;
      }
    };
    // Add event listener on mount
    window.addEventListener("keydown", handleKeyDown, true);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [suffle, loop, activeIndex, isSearchFocused, isCreatePlaylistFocused]); // Empty dependency array ensures this effect runs only on mount and unmount

  const showPlaylistSongs = () => {
    console.log("playlist songs :" + playlistSongs);
    console.log("updated playlist songs :" + updatedPlaylist);
  };
  return (
    <>
      <div className="mainPage">
        {/* <Playlist /> */}
        <VideoPlayer
          updatedPlaylist={updatedPlaylist}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isSearchFocused={isSearchFocused}
          isCreatePlaylistFocused={isCreatePlaylistFocused}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          suffle={suffle}
          loop={loop}
          playNextSong={playNextSong}
          playPreviousSong={playPreviousSong}
          setVideoSizeInMB={setVideoSizeInMB}
          isMiniPlayer={isMiniPlayer}
          setIsMiniPlayer={setIsMiniPlayer}
          isCinemaMode={isCinemaMode}
          setIsCinemaMode={setIsCinemaMode}
        />

        {/* only show this div if cinema mode is off */}
        {!isCinemaMode && (
          <Songs
            allSongs={allSongs}
            updatedPlaylist={updatedPlaylist}
            setAllSongs={setAllSongs}
            navbarData={navbarData}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            playlists={playlists}
            activePlaylist={activePlaylist}
            setActivePlaylist={setActivePlaylist}
            isCreatePlaylistFocused={isCreatePlaylistFocused}
            setIsCreatePlaylistFocused={setIsCreatePlaylistFocused}
            isCinemaMode={isCinemaMode}
          />
        )}
      </div>
      <div className="bottom-details-container">
        <Details
          song={allSongs[activeIndex]}
          videoSizeInMB={videoSizeInMB}
          suffle={suffle}
          setSuffle={setSuffle}
          playPrviousSong={playPreviousSong}
          playNextSong={playNextSong}
          loop={loop}
          handleLoop={handleLoop}
        />
      </div>

      {/* only show this div if cinema mode is off */}
      {isCinemaMode && (
        <Songs
          allSongs={allSongs}
          updatedPlaylist={updatedPlaylist}
          setAllSongs={setAllSongs}
          navbarData={navbarData}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          playlists={playlists}
          activePlaylist={activePlaylist}
          setActivePlaylist={setActivePlaylist}
          isCreatePlaylistFocused={isCreatePlaylistFocused}
          setIsCreatePlaylistFocused={setIsCreatePlaylistFocused}
          isCinemaMode={isCinemaMode}
        />
      )}
    </>
  );
};

export default Home;
