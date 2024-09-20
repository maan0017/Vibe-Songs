import { useState, useEffect, useRef } from "react";
import axios from "axios";

//importing icons
import closeIconWhite from "../../assets/icons/close(white).png";

const EditPlaylist = ({
  activePlaylist,
  setActivePlaylist,
  setShowEditDialog,
  isCreatePlaylistFocused,
  setIsCreatePlaylistFocused,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const inputRef = useRef();

  const handleCrossButton = () => {
    setActivePlaylist(newPlaylistName);
    setNewPlaylistName("");
    setIsCreatePlaylistFocused(false);
    setShowEditDialog(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/api/v1/playlists/edit-playlist", {
        activePlaylist,
        newPlaylistName,
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
    setNewPlaylistName(event.target.value);
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
        <div className="">
          <h1 className="" style={{ fontWeight: "bold", fontSize: "25px" }}>
            Enter New Playlist Name--
          </h1>
          <h6>
            Old Playlist Name "
            <span style={{ color: "red", fontWeight: "bold" }}>
              {activePlaylist}
            </span>
            "
          </h6>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="enter new playlist name"
              ref={inputRef}
              onFocus={handleFocus}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="mb-5 px-2"
            />
          </form>
          <button className="createPlaylist-btn" onClick={handleSubmit}>
            Update Playlist Name
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylist;
