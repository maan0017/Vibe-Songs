import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./CreatePlaylist.css";

//importing icons
import closeIconWhite from "../../assets/icons/close(white).png";

const CreatePlaylist = ({
  setShowAddDialog,
  isCreatePlaylistFocused,
  setIsCreatePlaylistFocused,
}) => {
  const inputRef = useRef();
  const [PlaylistName, setPlaylistName] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => {
    return state.auth;
  });

  const handleCrossButton = () => {
    setPlaylistName("");
    setIsCreatePlaylistFocused(false);
    setShowAddDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/api/v1/playlists/create-playlist", {
        PlaylistName,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
    handleCrossButton();
  };

  const handleFocus = () => {
    setIsCreatePlaylistFocused(true);
  };
  const handleBlur = () => {
    setIsCreatePlaylistFocused(false);
  };

  const handleChange = (event) => {
    setPlaylistName(event.target.value);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    inputRef.current.focus();
    console.log(PlaylistName);
  }, [PlaylistName]);

  // Use effect to set up and clean up the event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isCreatePlaylistFocused && event.key == "Enter") {
        handleSubmit();
        return;
      }
      if (isCreatePlaylistFocused && event.key == "Escape") {
        handleCrossButton();
      }
      switch (event.key) {
        default:
          break;
      }
    };
    // Add event listener on mount
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCreatePlaylistFocused]); // Empty dependency array ensures this effect runs only on mount and unmount

  return (
    <div className="createPlaylist-component">
      <div className="createPlaylist-container">
        <div className="cross-btn-container">
          <img src={closeIconWhite} onClick={handleCrossButton} />
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-center font-bold mb-5">Create New Playlist</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="enter playlist name"
              ref={inputRef}
              onFocus={handleFocus}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="mb-5 px-2"
            />
          </form>
          <button className="createPlaylist-btn" onClick={handleSubmit}>
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
