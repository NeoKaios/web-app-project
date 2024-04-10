import { getPlaylistItems } from '../lib/spotify-api';
import './analyse-page.scss';
import { useLoaderData } from "react-router-dom";
import { BACK_URL } from '../lib/consts';

export async function analyseLoader({ params: { playlist_id } }: any) {
  console.log('Loading analyse page...');
  console.log(playlist_id)
  const songs = await getPlaylistItems(playlist_id);
  //return songs;
  return songs.filter((track) => !track.preview_url);
}

async function sendAll() {
  const inputs = document.querySelectorAll<HTMLInputElement>('input[type=file]');
  const formData = new FormData();
  inputs.forEach(input => {
    if (input.files && input.files[0]) {
      console.log(input.id)
      formData.append(input.id, input.files[0]);
    }
  });
  console.log(formData);
  try {
    const uploadRes = await fetch(BACK_URL + "upload", {
      method: "POST",
      headers: {
      //'Content-Type':'application/x-www-form-urlencoded',
      'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    if (uploadRes.ok) {
      inputs.forEach(input => input.value = '');
    }
  } catch (err) {
    console.log(err);
  }
}

export function AnalysePage() {
  const tracks = useLoaderData() as Awaited<ReturnType<typeof analyseLoader>>;
  console.log(tracks);
  return (
    <div className='analyse-panel'>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Requested song ID</th>
            <th className='main'>Requested Song</th>
            <th>Selected file</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map(({ name, id }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td><input type="file" id={id} name="song" accept="audio/mpeg,audio/wav, audio/webm" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={sendAll}>Send all files</button>
    </div>
  );
}
