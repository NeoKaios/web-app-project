import { getPlaylistItems } from '../lib/spotify-api';
import './analyse-page.scss';
import { useLoaderData, useNavigate } from "react-router-dom";
import { ADMIN_TOKEN_COOKIE, BACK_URL } from '../lib/consts';
import { getCookie } from '../lib/cookie';

export async function analyseLoader({ params: { playlist_id } }: any) {
  console.log('Loading analyse page...');
  console.log(playlist_id)
  const songs = await getPlaylistItems(playlist_id);
  //return songs;
  return songs.filter((track) => !track.preview_url || track.preview_url.startsWith(BACK_URL));
}

async function sendAll() {
  const inputs = document.querySelectorAll<HTMLInputElement>('input[type=file]');
  const formData = new FormData();
  inputs.forEach(input => {
    if (input.files && input.files[0]) {
      formData.append(input.id, input.files[0]);
    }
  });
  console.log(formData);
  try {
    await fetch(BACK_URL + "upload", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + getCookie(ADMIN_TOKEN_COOKIE)
      },
      body: formData
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteExtra(track: string) {
  await fetch(BACK_URL + 'upload/delete/' + track,
    {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + getCookie(ADMIN_TOKEN_COOKIE)
      }
    });
}

export function AnalysePage() {
  const tracks = useLoaderData() as Awaited<ReturnType<typeof analyseLoader>>;
  const navigate = useNavigate();

  const performAndRefresh = async (method: any) => {
    await method();
    navigate(window.location.pathname);
  };

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
          {tracks.map(({ name, id, preview_url }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td className='file'>
                {preview_url ?
                  <>
                    <audio controls src={preview_url}></audio>
                    <button onClick={() => performAndRefresh(() => deleteExtra(id))}>Delete</button>
                  </>
                  : <input type="file" id={id} name="song" accept="audio/mpeg,audio/wav, audio/webm" />
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => performAndRefresh(sendAll)}>Send all files</button>
    </div>
  );
}
