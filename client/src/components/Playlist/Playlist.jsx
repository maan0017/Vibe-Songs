import "./Playlist.css";

const Playlist = () => {
  return (
    <div className="playlist">
      <nav className="mini-bar">playlist</nav>
      <hr />
      <ul className="playlist-lists">
        <li className="selected">all</li>
      </ul>
    </div>
  );
};

export default Playlist;
