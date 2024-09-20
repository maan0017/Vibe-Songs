import { Song } from '../models/songs.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { myVideoSongsPath, myAudioSongsPath } from '../constants.js';
import fs from 'fs';
import chalk from 'chalk';

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const scanSongsFolder = asyncHandler(async (req, res) => {
  console.log('/inserting new songs to db***********************');

  const allFiles = await fs.readdirSync(myVideoSongsPath, () => {});
  let count = 0;
  // console.log('all files ---', allFiles);
  // Read all files in the folder
  for (let i = 0; i < allFiles.length; i++) {
    let songName = allFiles[i];
    console.log(songName);

    const result = await Song.findOne({ name: songName });
    // console.log(result);
    if (result) continue;
    count++;
    const newSong = new Song({
      name: songName,
      // url: songPath, // Save the full path to the song as the URL
    });

    // Save the song to the database
    await newSong.save();
    await sleep(3000);
    console.log(`Song "${chalk.green(`${songName}`)}" has been saved.`);
  }
  console.log(chalk.green(`all files scanned and added ${count} songs successfully !!!`));
});
export const compareSongsFolder = asyncHandler(async (req, res) => {
  console.log('/inserting new songs to db***********************');

  const allVideoFiles = await fs.readdirSync(myVideoSongsPath, () => {});
  // console.log(allVideoFiles);
  let allVideos = allVideoFiles.map(song => {
    let pureSongName = song.replace('.mkv', '');
    pureSongName = pureSongName.replace('.av1', '');
    pureSongName = pureSongName.replace('.webm', '');
    pureSongName = pureSongName.replace('.mp4', '');
    pureSongName = pureSongName.replace('(1080P)', '');
    pureSongName = pureSongName.replace('(1080P_HD)', '');
    pureSongName = pureSongName.replace('(1080P_60FPS)', '');
    pureSongName = pureSongName.replace('(4K_HD)', '');
    pureSongName = pureSongName.replace('(4K_60FPS)', '');
    pureSongName = pureSongName.replace('(720P_HD)', '');
    pureSongName = pureSongName.replace('(360P)', '');
    pureSongName = pureSongName.replace('(480P)', '');
    return pureSongName;
  });

  // console.log(allVideos);

  const allAudioFiles = await fs.readdirSync(myAudioSongsPath, () => {});
  let allAudios = allAudioFiles.map(song => {
    let pureSongName = song.replace('.mp3', '');
    pureSongName = pureSongName.replace('(MP3_320K)', '');
    pureSongName = pureSongName.replace('(MP3_160K)', '');
    return pureSongName;
  });

  // console.log('my audio songs', allAudios);

  let uniqueAudioSongs = allAudios.filter(song => !allVideos.includes(song));
  let uniqueVideoSongs = allVideos.filter(song => !allAudios.includes(song));
  console.log('unique audio songs', uniqueAudioSongs);
  console.log('unique video songs', uniqueVideoSongs);

  res.send('compare songs folders');
});
