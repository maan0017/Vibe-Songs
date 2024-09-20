import "./Details.css";

//icons imported
import suffleIconWhite from "../../assets/icons/suffle(white).png";
import suffleIconRed from "../../assets/icons/suffle(red).png";
import previousIconWhite from "../../assets/icons/previous(white).png";
// import playIconPink from "../../assets/icons/play(pink).png";
import nextIconWhite from "../../assets/icons/next(white).png";
import loopIconWhite from "../../assets/icons/loop(white).png";
import noLoopIconWhite from "../../assets/icons/right-arrow(white).png";
import repeatIconWhite from "../../assets/icons/loop-one(white&red).png";

const Details = ({
  song,
  videoSizeInMB,
  suffle,
  setSuffle,
  playPrviousSong,
  playNextSong,
  loop,
  handleLoop,
}) => {
  const toggleSuffle = () => {
    setSuffle(!suffle);
  };

  const handleLoopButton = () => {
    handleLoop();
  };

  return (
    <>
      <div className="flex w-full">
        <div className="video-title">{song}</div>
        <div className="flex bg-black text-white px-4 justify-center items-center">
          size:{" "}
          <span className="mx-1 text-green-500">
            {videoSizeInMB ? videoSizeInMB.toFixed(1) : "-"}
          </span>
          MB
        </div>
      </div>
      <div className="music-controls">
        <img
          src={suffle == 0 ? suffleIconWhite : suffleIconRed}
          onClick={toggleSuffle}
          alt="suffle-icon"
          className="controls-btn2 suffle-icon"
        />
        <img
          src={previousIconWhite}
          onClick={playPrviousSong}
          alt="previous-song-btn"
          className="controls-btn2 previous-song"
        />
        {/* <img
          src={playIconPink}
          alt="play-pause-icon"
          className="controls-btn play-pause-btn2"
        /> */}
        <img
          src={nextIconWhite}
          onClick={playNextSong}
          alt="next-song-btn"
          className="controls-btn2 next-song"
        />
        <img
          src={
            loop == 0
              ? loopIconWhite
              : loop == 1
                ? noLoopIconWhite
                : repeatIconWhite
          }
          onClick={handleLoopButton}
          alt="loop-icon"
          className="controls-btn2 loop-icon"
        />
      </div>
    </>
  );
};

export default Details;
