import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DeletePlaylist.css";

//importing icons
import closeIconWhite from "../../assets/icons/close(white).png";

const DeletePlaylist = ({
  activePlaylist,
  setActivePlaylist,
  setShowDeleteDialog,
  isCreatePlaylistFocused,
  setIsCreatePlaylistFocused,
}) => {
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef();

  const handleCrossButton = () => {
    setUserInput("");
    setIsCreatePlaylistFocused(false);
    setShowDeleteDialog(false);
  };

  const handleSubmit = async (event) => {
    if (userInput.toLowerCase() != "delete") return;
    event.preventDefault();

    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3000/api/v1/playlists/delete-playlist", {
        activePlaylist,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
    setActivePlaylist("All Songs");
    handleCrossButton();
  };

  const handleFocus = () => {
    setIsCreatePlaylistFocused(true);
  };
  const handleBlur = () => {
    setIsCreatePlaylistFocused(false);
  };

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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
          <h1 className="text-2xl font-bold mb-5 text-red-700">
            Confirm Delete
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='type "delete" to confirm'
              ref={inputRef}
              onFocus={handleFocus}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="mb-5 px-2"
            />
          </form>
          <button className="deletePlaylist-btn" onClick={handleSubmit}>
            Delete Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlaylist;
