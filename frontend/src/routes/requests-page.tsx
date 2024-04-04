import { fetchRequests } from '../lib/requests';
import { getPlaylist } from '../lib/spotify-api';
import './requests-page.scss';
import { useLoaderData } from "react-router-dom";

export async function requestsLoader() {
    console.log('Loading requests page...');
    const reqArray = await fetchRequests()
    const playlistNameArray :string[] = []

    if (reqArray == undefined){
        return [];
    }

    for (let i=0;i < reqArray.length;i++){
        try {
            const playlist = (await getPlaylist(reqArray[i]));
            playlistNameArray.push(playlist.name);
        } catch (error) {
            console.log('%s is not a valid playlist id', reqArray[i])
        }
    }
    console.log("RETURNING");
    console.log(playlistNameArray);
    return playlistNameArray;
  }
  

export function RequestsPage() {
    const requests = useLoaderData() as Awaited<ReturnType<typeof requestsLoader>>;
    console.log(requests)
    console.log(requests.length)
    return (
        <table className="requests-table">
        <thead>
            <tr>
            <th>Request ID</th>
            <th>Requested Song</th>
            </tr>
        </thead>
        <tbody>
            {requests.map((request, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td> <div dangerouslySetInnerHTML={{ __html: request }} /></td>
            </tr>
            ))}
        </tbody>
        </table>
        );
}
