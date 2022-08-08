//import SpotifyPlayer from 'react-spotify-web-playback'
import ReactPlayer from 'react-player/youtube'
import {useEffect, useState} from 'react'
const BaseURL = 'https://www.youtube.com/watch?v='
const bypass_viewer_discretionary = '&bpctr=9999999999'
const KEY = "AIzaSyB9MUudXyynejMUw_XZQus3djYO54hq2lY";
const checkAvailablility = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails`;

export default function Player({ playingTrack }) {
  const [urls, setUrls] = useState([]);
  console.log(urls);
  
  useEffect(() => {
    if(playingTrack)
    setUrls([`${BaseURL}${playingTrack}${bypass_viewer_discretionary}`]);
  }, [playingTrack])
  if(urls.length < 1) return (
    <div>
    </div>
  )
  return (
    <div style={{ maxWidth: '100vh'}}>
      <ReactPlayer 
        url={urls} 
        playing={true}
        loop={false}
        width='100%'
        height='100%'
      />
    </div>
    
  )
}
