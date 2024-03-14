import { SimplifiedPlaylist } from "spotify-types";
import { PlaylistElement } from "..";
import './playlist-list.scss';

export function PlaylistList({ playlists }: { playlists: SimplifiedPlaylist[] }) {
  return <div className="playlist-li">
    {playlists.map((playlist) => {
      return <PlaylistElement playlist={playlist}></PlaylistElement>
    })}
  </div>
}
