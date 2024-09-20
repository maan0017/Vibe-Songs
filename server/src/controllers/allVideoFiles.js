import fs from 'fs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { myVideoSongsPath } from '../constants.js';

const allVideoFiles = asyncHandler(async (req, res) => {
  fs.readdir(myVideoSongsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory' });
    }

    // Filter only video files (you can adjust the extensions)
    const videoFiles = files.filter(file => {
      return file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mkv');
    });
    // console.log('all videos name', videoFiles);

    // Send the array of video file names as the response
    return res.json(videoFiles);
  });
});

const getFileSize = asyncHandler(async (req, res) => {
  const { file } = req.body;
  console.log(file);
  const myVideoSongsPath = 'D:/videos/vibe_songs/vibeSongs';
  fs.stat(myVideoSongsPath + '/' + file, (err, stats) => {
    if (err) {
      console.log(err);
      return;
    }
    //file size in bytes
    const fileSizeInBytes = stats.size;
    //convert fileSizeInMB
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    console.log('file ' + file + ' size = ' + fileSizeInMB.toFixed(2) + ' MB');
    return res.json(fileSizeInMB);
  });
});

export { allVideoFiles, getFileSize };

// Specify the directory you want to read
// const myVideoSongsPath = 'D:/videos/vibe_songs/vibeSongs';

// Function to filter video files
// function isVideoFile(fileName) {
//   const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv'];
//   return videoExtensions.includes(path.extname(fileName).toLowerCase());
// }

// Create an HTTP server
// const allVideoFiles = http.createServer((req, res) => {
//   if (req.url === '/videos' && req.method === 'GET') {
//     // Read the directory
//     fs.readdir(myVideoSongsPath, (err, files) => {
//       if (err) {
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         return res.end(JSON.stringify({ error: 'Unable to scan directory' }));
//       }

//       // Filter video files
//       const videoFiles = files.filter(isVideoFile);

//       // Send the response as a JSON array
//       res.writeHead(200, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify(videoFiles));
//     });
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Not Found');
//   }
// });

// Start the server
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });
