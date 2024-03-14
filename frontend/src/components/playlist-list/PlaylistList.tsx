import { useState } from "react";
import { SimplifiedPlaylist } from "spotify-types";
import { PlaylistElement } from "..";
import { ACCESS_TOKEN_COOKIE } from "../../lib/consts";
import { getCookie } from "../../lib/cookie";
import { fetchPlaylists } from "../../lib/fetchPlaylists";
import './playlist-list.scss';

export function PlaylistList() {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();

  const getPlaylistsAsync = async (access_token: string) => {
    setPlaylists(await fetchPlaylists(access_token));
  };

  const access_token = getCookie(ACCESS_TOKEN_COOKIE);

  if (access_token === undefined) {
    return null;
  }
  else if (playlists == null) {
    getPlaylistsAsync(access_token);
    return null;
  }
  return <div className="playlist-li">
    {playlists.map((playlist) => {
      return <PlaylistElement playlist={playlist}></PlaylistElement>
    })}
  </div>
}
