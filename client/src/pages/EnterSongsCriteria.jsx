import { useState, useEffect } from "react";
import axios from "axios";

const EnterSongsCriteria = () => {
  const [allSongs, setAllSongs] = useState([]);
  const [name, setName] = useState("");
  const [singer, setSinger] = useState([]);
  const [language, setLanguage] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    //axios request to get all videos
    axios.get("http://localhost:3000/api/v1/videos/all-videos").then((res) => {
      console.log(res.data);
      setAllSongs(res.data);
    });
  }, []);
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const startProgramme = async () => {
    console.log(allSongs.length);
    axios.post("http://localhost:3000/api/v1/songs/auto-fill-credentials", {});
  };

  return (
    <div className="w-full h-screen bg-slate-800 flex flex-col justify-center items-center">
      {/* <p className="text-white absolute left-0 ml-16 mb-14">
        Song Name :
        <span className="text-green-500 text-nowrap text-xl">{name}</span>
      </p>
      <br />
      <input type="text" className="w-[90vw] px-4 py-1" /> */}
      <button onClick={startProgramme}>start</button>
    </div>
  );
};
export default EnterSongsCriteria;
