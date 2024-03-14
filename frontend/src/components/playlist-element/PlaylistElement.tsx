import { SimplifiedPlaylist } from "spotify-types";
import './playlist-element.scss';

export function PlaylistElement({ playlist }: { playlist: SimplifiedPlaylist }) {
  return <div className="playlist-el">
    <img src={playlist.images[0].url} alt={"Playlist " + playlist.name} />
    {playlist.name}
  </div>
}
