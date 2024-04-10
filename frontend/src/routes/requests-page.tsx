import { fetchRequests } from '../lib/requests';
import { getPlaylist } from '../lib/spotify-api';
import './requests-page.scss';
import { useLoaderData, useNavigate } from "react-router-dom";

export async function requestsLoader() {
  console.log('Loading requests page...');
  const reqArray = await fetchRequests()
  const requestedPlaylists: { name: string, id: string }[] = []


  if (reqArray === undefined) {
    return [];
  }

  for (let i = 0; i < reqArray.length; i++) {
    try {
      const playlist = (await getPlaylist(reqArray[i]));
      requestedPlaylists.push({ name: playlist.name, id: playlist.id });
    } catch (error) {
      console.log('%s is not a valid playlist id', reqArray[i])
    }
  }
  console.log(requestedPlaylists);
  return requestedPlaylists;
}

export function RequestsPage() {
  const navigate = useNavigate();
  const requests = useLoaderData() as Awaited<ReturnType<typeof requestsLoader>>;
  console.log(requests)
  console.log(requests.length)
  return (
    <table className="requests-table">
      <thead>
        <tr>
          <th>Playlist ID</th>
          <th className='main'>Requested Playlist</th>
          <th>Analyse missing songs</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(({ name, id }) => (
          <tr key={id}>
            <td>{id}</td>
            <td> <div dangerouslySetInnerHTML={{ __html: name }} /></td>
            <td><button onClick={() => {navigate('/analyse/' + id)}}>Analyse</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
