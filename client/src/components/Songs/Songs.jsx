import { useEffect, useState, useRef } from "react";
import CreatePlaylist from "../Playlist/CreatePlaylist.jsx";
import EditPlaylist from "../Playlist/EditPlaylist.jsx";
import DeletePlaylist from "../Playlist/DeletePlaylist.jsx";
import "./Songs.css";

//importing images
import plusIconWhite from "../../assets/icons/plus(white)-24.png";
import addIconBalck from "../../assets/icons/add.png";
import editTextIconWhite from "../../assets/icons/edit-text(white)-24.png";
import trashIconRed from "../../assets/icons/trash-can(red)-24.png";
import AddSongToPlaylists from "../Playlist/AddSongToPlaylists.jsx";

const Songs = ({
  allSongs,
  updatedPlaylist,
  setAllSongs,
  navbarData,
  activeIndex,
  setActiveIndex,
  playlists,
  activePlaylist,
  setActivePlaylist,
  isCreatePlaylistFocused,
  setIsCreatePlaylistFocused,
  isCinemaMode,
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddSongToPlaylistDialog, setShowAddSongToPlaylistDialog] =
    useState(false);

  //varouble for the song that will be added to playlists
  const [selectedSong, setSelectedSong] = useState();

  // State to track the index of the hovered item
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Create refs for each li element
  const liRefs = useRef([]);
  // Function to focus the current song
  const focusCurrentSong = () => {
    if (liRefs.current[activeIndex]) {
      liRefs.current[activeIndex].focus();
    }
  };

  // Event handlers to update the hovered index
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // console.log("playlists data :>", playlists);

  const handleAddPlaylist = () => {
    console.log("create new playlist button clicked");
    setShowAddDialog(true);
  };
  const handleEditPlaylist = () => {
    console.log("edit playlist button clicked");
    setShowEditDialog(true);
  };
  const handleDeletePlaylist = () => {
    console.log("delete playlist button clicked");
    setShowDeleteDialog(true);
  };
  const handleAddSongToPlaylist = (song) => {
    console.log("selected song = ", song);
    setSelectedSong(song);
    setShowAddSongToPlaylistDialog(true);
  };

  // Handle the change event when the user selects a different option
  const handleChange = (event) => {
    console.log("Selected option:", event.target.value);
    setActivePlaylist(event.target.value);
  };

  // Focus the current song whenever the currentSongIndex changes
  useEffect(() => {
    focusCurrentSong();
  }, [activeIndex]);

  useEffect(() => {
    console.log("this is the active playlist : ", activePlaylist);
  }, [activePlaylist]);

  useEffect(() => {
    setActivePlaylist(activePlaylist);
  }, [navbarData]);

  return (
    <div className={isCinemaMode ? "flex justify-center" : "songs-contianer"}>
      <div className={isCinemaMode ? "w-[100%]" : "first-container"}>
        <div
          className={isCinemaMode ? "bg-gray-950 text-white px-52" : "songs"}
        >
          <div className={isCinemaMode ? "flex py-3" : "songs-top-container"}>
            <select
              // id="playlists-dropdown"
              value={activePlaylist}
              onChange={handleChange}
              className={
                isCinemaMode
                  ? "text-black w-full h-5 text-center"
                  : "playlists-dropdown max-w-[60%] h-9"
              }
            >
              <option>All Songs</option>
              {playlists.map((playlist, index) => (
                <option
                  key={index}
                  // value={playlist.toLowerCase().replace(" ", "")}
                  // onMouseEnter={() => handleMouseEnter(index)}
                  // onMouseLeave={handleMouseLeave}
                  value={playlist.name}
                >
                  {playlist.name}
                </option>
              ))}
            </select>
            <img
              src={plusIconWhite}
              onClick={handleAddPlaylist}
              className="playlist-container-icons"
              style={{
                marginRight: activePlaylist === "All Songs" ? "9.25vw" : "5px",
              }}
            />
            <img
              src={editTextIconWhite}
              onClick={handleEditPlaylist}
              className="playlist-container-icons"
              style={{
                display: activePlaylist === "All Songs" ? "none" : "flex",
              }}
            />
            <img
              src={trashIconRed}
              onClick={handleDeletePlaylist}
              className="delete-playlist-container-icons"
              style={{
                display: activePlaylist === "All Songs" ? "none" : "flex",
              }}
            />
          </div>

          {/* display total songs of a playlist */}
          <div className="ml-1 font-serif bg-black text-center my-1 py-1 text-white">
            <p>
              total songs :{" "}
              <span className="text-green-500"> {updatedPlaylist.length}</span>
            </p>
          </div>

          <hr />
          <ol className={isCinemaMode ? "bg-slate-800 px-3" : "songs-list"}>
            {updatedPlaylist.map((song, index) => (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                ref={(el) => (liRefs.current[index] = el)} // Assign ref for each <li>
                tabIndex={isCinemaMode ? "false" : 0} // Make the <li> focusable
                className={
                  isCinemaMode
                    ? `py-1 mb-2 hover:text-blue-500 border-black border-2 rounded-sm px-2 hover:cursor-pointer ${
                        activeIndex === index
                          ? "active relative pr-8"
                          : "relative pr-8"
                      }`
                    : `${
                        activeIndex === index
                          ? "active relative pr-8"
                          : "relative pr-8"
                      }`
                }
                onClick={() => setActiveIndex(index)}
              >
                <div className="song-names"> {song}</div>
                {(activeIndex === index || hoveredIndex === index) && (
                  <img
                    src={addIconBalck}
                    onClick={() => handleAddSongToPlaylist(song)}
                    className="add-round-icon w-9 h-full py-1 flex justify-center px-2 bg-white items-center absolute right-0 rounded top-1/2 transform -translate-y-1/2"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="second-container">
        {showAddDialog && (
          <CreatePlaylist
            setShowAddDialog={setShowAddDialog}
            isCreatePlaylistFocused={isCreatePlaylistFocused}
            setIsCreatePlaylistFocused={setIsCreatePlaylistFocused}
          />
        )}
        {showEditDialog && (
          <EditPlaylist
            activePlaylist={activePlaylist}
            setActivePlaylist={setActivePlaylist}
            setShowEditDialog={setShowEditDialog}
            isCreatePlaylistFocused={isCreatePlaylistFocused}
            setIsCreatePlaylistFocused={setIsCreatePlaylistFocused}
          />
        )}
        {showDeleteDialog && (
          <DeletePlaylist
            activePlaylist={activePlaylist}
            setActivePlaylist={setActivePlaylist}
            setShowDeleteDialog={setShowDeleteDialog}
            isCreatePlaylistFocused={isCreatePlaylistFocused}
            setIsCreatePlaylistFocused={setIsCreatePlaylistFocused}
          />
        )}
        {showAddSongToPlaylistDialog && (
          <AddSongToPlaylists
            selectedSong={selectedSong}
            playlists={playlists}
            showAddSongToPlaylistDialog={showAddSongToPlaylistDialog}
            setShowAddSongToPlaylistDialog={setShowAddSongToPlaylistDialog}
          />
        )}
      </div>
    </div>
  );
};

export default Songs;
