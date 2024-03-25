import { useLoaderData } from "react-router-dom";
import { FourButton, Player } from "../components";
import { ERROR_PLAYLIST_IS_TOO_SMALL } from "../lib/consts";
import { randomNChoices } from "../lib/random";
import { getPlaylist, getPlaylistItems } from "../lib/spotify-api";

export async function trainingLoader({ params: { playlist_id } }: any) {
  console.log('Loading playlist training page...');
  const tracks = await getPlaylistItems(playlist_id);
  const playlistInfo = await getPlaylist(playlist_id);
  return { tracks, playlistInfo };
}

export function TrainingPage() {
  const { tracks: allTracks, playlistInfo } = useLoaderData() as Awaited<ReturnType<typeof trainingLoader>>;
  console.log(allTracks)
  const tracks = allTracks.filter(track => track.preview_url);
  if (tracks.length < 4) {
    throw new Error(ERROR_PLAYLIST_IS_TOO_SMALL);
  }

  console.log(tracks)
  console.log(playlistInfo)

  const choices = randomNChoices(tracks, 4);
  const selectedTrack = choices[0];
  const buttonChoices = choices.map(({ id, name }) => ({ text: name, id }));


  return (
    <div className="training-page">
      <h2>Training on {playlistInfo.name}</h2>
      <Player preview_url={selectedTrack.preview_url} />
      <FourButton choices={buttonChoices} />
    </div>
  );
}
