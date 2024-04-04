import './admin-page.scss';
import { useLoaderData } from "react-router-dom";

export async function adminLoader() {
    console.log('Loading admin page...');
    return null;
  }
  

export function AdminPage() {
  return (
    <div id="admin-page">
      <h1>Welcome Admin!</h1>
      <p>Your annoying clients made some <a href="/requests">requests</a> </p>
    </div>);
}
