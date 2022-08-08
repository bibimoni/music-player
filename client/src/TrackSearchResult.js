import React, { useCallback } from 'react'
import { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { KEY } from './CONSTANT'
const baseURLGoogle = `https://www.googleapis.com/youtube/v3/search?key=${KEY}&type=video&part=snippet&maxResults=1&q=`;

export const useIsMounted = () => {
    const mountedRef = useRef(false);
    const isMounted = useCallback(() => mountedRef.current, []);
    
    useEffect(() => {
        mountedRef.current = true;
        return () => {
        mountedRef.current = false;
        };
    });
    return isMounted;
};

export default function TrackSearchResult({ track, handleYoutubeSearch }) { 
    const isMounted = useRef(true)
    const [searching, setSearching] = useState(false);   
    const [playingTrack, setPlayingTrack] = useState("");
    console.log(searching)
    const videoId = async() => {
        axios
            .get(`${baseURLGoogle}${track.title} ${track.artist}`)
            .then(res => {
                setPlayingTrack(res.data.items[0].id.videoId);  
            })
            .catch(err => {
                console.error(err)
            })  
            .finally(() => {
                console.log('done');
            })
            }
    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, [])
    
    const search = useCallback(async() => {
        
        if(searching) return;
        
        setSearching(true);  
        await videoId(); 
        console.log('a');
        handleYoutubeSearch(playingTrack)
        setSearching(false);
        
    }, [searching]);
    
    return (
        <div className="d-flex m-2 align-items-center" 
            style={{cursor: 'pointer'}}
            onClick={search}>
            <img src={track.albumUrl} style={{height : '64px', width:'64px'}}></img>
            <div className="ms-3">
                <div>{track.title}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
        </div>
    )
}
