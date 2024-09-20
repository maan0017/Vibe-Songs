import { asyncHandler } from '../utils/asyncHandler.js';
import { apiErrors } from '../utils/apiErrors.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Playlist } from '../models/playlists.model.js';
import { User } from '../models/user.model.js';
import chalk from 'chalk';

const displayAllPlaylists = asyncHandler(async (req, res) => {
  console.log('/return playlists');
  try {
    const playlistsObject = await Playlist.find().select('name'); // Fetch all playlists
    console.log('All Playlists:', playlistsObject);
    // const PlaylistsArray = PlaylistNameExtractor(playlistsObject);
    // console.log(PlaylistsArray);
    return res.json(playlistsObject);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw new apiErrors(500).json({ message: 'Error fetching playlists', error });
  }
});
const createPlaylist = asyncHandler(async (req, res) => {
  //1.get details from frontend
  console.log('/add playlist');
  console.log(req.body);
  const { PlaylistName } = req.body;
  console.log(PlaylistName);

  //2.validation - playlist name is not empty
  if ([PlaylistName].some(field => field?.trim() === '')) {
    throw new apiErrors(400, 'playlist name is required');
  }

  //3.check playlist already exists
  const existedPlaylist = await Playlist.findOne({ name: PlaylistName });
  if (existedPlaylist) {
    throw new apiErrors(409, `playlist already exists in mongoose`);
  }

  //4.create playlist object - insert data in db
  const playlistMongoose = await Playlist.create({ name: PlaylistName, createdBy: req.user._id });
  // Update user to add the new playlist
  await User.findByIdAndUpdate(req.user._id, { $push: { playlists: playlistMongoose._id } });

  //5.check user entery but don't display their password
  const createdPlaylistMongoose = await Playlist.findById(playlistMongoose._id);

  //6.check for playlist creation
  if (!createdPlaylistMongoose) {
    throw new apiErrors(500, 'something went wrong during inserting data in mongoose');
  }

  //7.return res
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { PlaylistName: PlaylistName },
        'playlist recived and stored in database successfully',
      ),
    );
});
const editPlaylistName = asyncHandler(async (req, res) => {
  console.log('/edit-playlist');

  //1.get old and new playlist name from frontend
  console.log(req.body);
  const { activePlaylist, newPlaylistName } = req.body;

  //2.validate that new playlist name is not empyt
  if ([newPlaylistName].some(field => field?.trim() === '')) {
    throw new apiErrors(400, 'new playlist name is required');
  }

  //3.
  try {
    const updatePlaylistName = await Playlist.findOneAndUpdate(
      { name: activePlaylist },
      { name: newPlaylistName },
      {
        new: true,
        runValidators: false,
      },
    );
    console.log('updated playlist :', updatePlaylistName);
  } catch (err) {
    throw new apiErrors(500, 'error occured during updating data in DB');
  }

  //4. return res
  return res.status(200).json(
    new apiResponse(
      200,
      {
        oldName: activePlaylist,
        newName: newPlaylistName,
      },
      'playlist name successfully change',
    ),
  );
});
const deletePlaylistByName = asyncHandler(async (req, res) => {
  //1.get playlist name from frontend
  console.log('/delete-playlist');
  console.log(req.body);
  const { activePlaylist } = req.body;

  //2.validation check that playlist name is not empty
  if ([activePlaylist].some(field => field?.trim() === '')) {
    throw new apiErrors(400, 'playlist name is required');
  }

  //3.check for playlist existance  // delete playlist from DB
  try {
    const deletedPlaylist = await Playlist.findOneAndDelete({ name: activePlaylist });
    if (deletedPlaylist) {
      console.log('Deleted playlist:', deletedPlaylist._id);
    } else {
      console.log('No playlist found with that name.');
      throw new apiErrors(500, 'no playlsit found');
    }

    //remove the playlist from the user's playlists array
    await User.findByIdAndUpdate(req.user._id, { $pull: { playlists: deletedPlaylist._id } });
  } catch (error) {
    throw new apiErrors(500, 'error occured during playlist deletion');
  }

  //5.return res
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { deletedPlaylist: activePlaylist },
        'playlist deleted successfully from database',
      ),
    );
});

//function to ensure uniqueness
const checkSongInPlaylists = asyncHandler(async (req, res) => {
  //get playlist name from frontend
  console.log(req.body);
  const { selectedSong } = req.body;

  try {
    const allPlaylistNames = await Playlist.find().select('name');
    const playlistName = await Playlist.find({ songs: selectedSong }).select('name');

    console.log(`${chalk.green("new updated playlist names with 'isChecked' field --")}`);
    console.log(allPlaylistNames);
    console.log(playlistName);
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { allPlaylistNames: allPlaylistNames, playlistName: playlistName },
          'matches',
        ),
      );
  } catch (error) {
    throw new apiErrors(
      500,
      'something went wrong while fetching songs of playlists from database',
    );
  }
});
//add song to playlists
const addSongToPlaylists = asyncHandler(async (req, res) => {
  //1.extract data form frontedn
  console.log(req.body);
  const { selectedSong, updatedPlaylists } = req.body;
  // console.log(selectedSong);
  // console.log(checkedPlaylists);
  let addToPlaylists = [];
  let removeFromPlaylists = [];
  for (const i in updatedPlaylists) {
    if (updatedPlaylists[i].isChecked) {
      const temp = updatedPlaylists[i].name;
      addToPlaylists.push(temp);
    } else {
      const temp = updatedPlaylists[i].name;
      removeFromPlaylists.push(temp);
    }
  }

  try {
    const resultAddToPlaylists = await Playlist.updateMany(
      { name: { $in: addToPlaylists } }, // Empty filter to target all documents
      { $addToSet: { songs: selectedSong } }, // $addToSet ensures uniqueness
      { new: true }, // Return the updated document, // $push adds the song to the array
    );
    const resultRemoveFromPlaylists = await Playlist.updateMany(
      { name: { $in: removeFromPlaylists } },
      { $pull: { songs: selectedSong } },
      { new: true },
    );

    console.log(`added song to ${resultAddToPlaylists.modifiedCount} playlists.`);
    console.log(`removed song from ${resultRemoveFromPlaylists.modifiedCount} playlists.`);
  } catch (error) {
    console.error('Error updating playlists:', error);
  }
});
const getSongsFromPlaylist = asyncHandler(async (req, res) => {
  //get playlist name from frontend
  console.log(req.body);
  const { activePlaylist } = req.body;

  try {
    const playlistSongs = await Playlist.find({ name: activePlaylist }).select('songs');
    console.log(playlistSongs);
    return res.status(200).json(playlistSongs);
  } catch (error) {
    throw new apiErrors(
      500,
      'something went wrong while fetching songs of playlists from database',
    );
  }
});
export {
  displayAllPlaylists,
  createPlaylist,
  editPlaylistName,
  deletePlaylistByName,
  checkSongInPlaylists,
  addSongToPlaylists,
  getSongsFromPlaylist,
};
