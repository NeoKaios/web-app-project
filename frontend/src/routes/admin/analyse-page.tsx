import { getPlaylist, getPlaylistItems } from '../../lib/spotify-api';
import './analyse-page.scss';
import { useLoaderData, useNavigate } from "react-router-dom";
import { BACK_URL } from '../../lib/consts';
import { deleteExtra, deleteRequest, uploadAudioFiles } from '../../lib/backend-api';

export async function analyseLoader({ params: { playlist_id } }: any) {
  console.log('Loading analyse page...');
  const playlist = await getPlaylist(playlist_id);
  const tracks = await getPlaylistItems(playlist_id);
  tracks.sort((a,b) => {
    const a_score = a.preview_url ? (a.preview_url.startsWith(BACK_URL) ? 0 : 1) : -1;
    const b_score = b.preview_url ? (b.preview_url.startsWith(BACK_URL) ? 0 : 1) : -1;
    return a_score - b_score;
  });
  return { tracks, playlist };
}

async function sendAll() {
  const inputs = document.querySelectorAll<HTMLInputElement>('input[type=file]');
  const formData = new FormData();
  inputs.forEach(input => {
    if (input.files && input.files[0]) {
      formData.append(input.id, input.files[0]);
    }
  });
  uploadAudioFiles(formData);
}


export function AnalysePage() {
  const { tracks, playlist } = useLoaderData() as Awaited<ReturnType<typeof analyseLoader>>;
  const navigate = useNavigate();

  const performAndRefresh = async (method: any) => {
    await method();
    navigate(window.location.pathname);
  };

  const deleteRequestAndBack = () => {
    deleteRequest(playlist.id);
    navigate('/requests');
  }

  return (
    <div className='analyse-panel'>
      <h2>{playlist.name}</h2>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Requested song ID</th>
            <th className='main'>Requested Song</th>
            <th>Audio</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map(({ name, id, preview_url }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td> {preview_url ? <div className='audio-cell'>{preview_url.startsWith(BACK_URL) ? "LOCAL" : "SPOTIFY"} <audio controls src={preview_url}></audio></div> : "No song present"}</td>
              <td>
                {(!preview_url || !preview_url.startsWith(BACK_URL)) ?
                  <input type="file" id={id} name="song" accept="audio/mpeg,audio/wav, audio/webm" />
                  : <button onClick={() => performAndRefresh(() => deleteExtra(id))}>Delete</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => performAndRefresh(sendAll)}>Send all files</button>
      <button onClick={deleteRequestAndBack}>Delete request</button>
    </div>
  );
}
