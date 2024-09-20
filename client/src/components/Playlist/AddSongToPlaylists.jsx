import { useEffect, useState } from "react";
import axios from "axios";
import closeIconWhite from "../../assets/icons/close(red).png";
import "./AddSongToPlaylist.css";

const AddSongToPlaylists = ({
  selectedSong,
  showAddSongToPlaylistDialog,
  setShowAddSongToPlaylistDialog,
}) => {
  //initalize state as an empty object
  const [allPlaylistNames, setAllPlaylistNames] = useState([]);
  const [checkedPlaylists, setCheckedPlaylists] = useState([]);
  const [updatedPlaylists, setUpdatedPlaylists] = useState([]);

  const handleCrossButton = () => {
    setShowAddSongToPlaylistDialog(false);
  };

  useEffect(() => {
    axios
      .post("http://localhost:3000/api/v1/playlists/check-song-in-playlists", {
        selectedSong,
      })
      .then((res) => {
        console.log("playlist NameX---", res.data);
        setAllPlaylistNames(res.data.data.allPlaylistNames);
        setCheckedPlaylists(res.data.data.playlistName);
      });
  }, [showAddSongToPlaylistDialog]);

  // Update array with 'isChecked' field
  useEffect(() => {
    const newArray = allPlaylistNames.map((item) => ({
      ...item,
      isChecked: checkedPlaylists.some((compItem) => compItem._id === item._id),
    }));
    setUpdatedPlaylists(newArray);
  }, [allPlaylistNames, checkedPlaylists]);

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/v1/playlists/add-to-playlist", {
        selectedSong,
        updatedPlaylists,
      })
      .then((res) => {
        console.log(res.data);
      });
    console.log(checkedPlaylists);
    handleCrossButton();
  };

  //function to handle checkbox toggle
  const handleCheckboxChange = (event) => {
    // event.preventDefault();
    const { name, checked } = event.target;
    console.log(name, checked);
    let tempUser = updatedPlaylists.map((playlist) =>
      playlist.name === name ? { ...playlist, isChecked: checked } : playlist,
    );
    setUpdatedPlaylists(tempUser);
    console.log(updatedPlaylists);
  };

  return (
    <div className="createPlaylist-component">
      <div className="w-full h-auto max-h-[75vh] max-w-[30vw] bg-blue-950 rounded-md mx-9  flex flex-col overflow-hidden overflow-y-scroll">
        <div className="cross-btn-container hover:bg-black p-2 ">
          <img src={closeIconWhite} onClick={handleCrossButton} />
        </div>
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-sm font-bold font-mono text-white ">
            song -
            <br />
            <span className="text-sm text-green-400 font-serif">
              {selectedSong}
            </span>
          </h1>
          <div className="max-w-[23vw] w-[20vw] h-96 flex flex-col text-2xl text-white text-nowrap my-2 items-start overflow-y-scroll overflow-x-hidden border border-gray-300 pl-7 pr-28">
            {updatedPlaylists.map((playlist, index) => (
              <label
                onSubmit={handleSubmit}
                key={index}
                className="my-1 flex items-center"
              >
                <input
                  type="checkbox"
                  name={playlist.name}
                  checked={playlist?.isChecked || false}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 mx-1 hover:cursor-pointer"
                />
                {playlist.name}
              </label>
            ))}
          </div>
          <button
            className="text-1xl createPlaylist-btn text-nowrap my-3"
            onClick={handleSubmit}
          >
            Add Song To Playlists
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSongToPlaylists;
