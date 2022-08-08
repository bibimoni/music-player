import React, { useState, useEffect } from "react";
import UseAuth from "./UseAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./player";
import { client_id } from "./CONSTANT"

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
});

export default function Dashboard({ code }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const accessToken = UseAuth(code);
  const [playingTrack, setPlayingTrack] = useState("");

  //searching youtube for the track
  function handleYoutubeSearch(videoId) {
    setPlayingTrack(videoId)
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    //search query
    //when searching, dont send request, only do it after searching
    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      //go to the result, get artist, name, uri and the album uri
      setSearchResults(
        res.body.tracks.items.map((track) => {
          //find smallest album image
          const smallestImage = track.album.images.reduce((smallest, image) => {
            if (image.height < smallest.height) return image;
            return smallest;
          }, track.album.images[0]);

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestImage.url,
          };
        })
      );
    });
    //when there is a request in the useEffect period but there already requested, cancel it
    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="search Songs/ Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            handleYoutubeSearch={handleYoutubeSearch}
          />
        ))}
      </div>
      <Player playingTrack={playingTrack}/>
    </Container>
  );
}
