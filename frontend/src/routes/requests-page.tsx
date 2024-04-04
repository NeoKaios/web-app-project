import './requests-page.scss';
import { useLoaderData } from "react-router-dom";

export async function requestsLoader() {
    console.log('Loading requests page...');
    return ["Song 1", "Song 2"];
  }
  

export function RequestsPage() {
    const requests = useLoaderData() as Awaited<ReturnType<typeof requestsLoader>>;

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
                <td>{request}</td>
            </tr>
            ))}
        </tbody>
        </table>
        );
}
