import './admin-page.scss';
import { Link } from "react-router-dom";

export async function adminLoader() {
  console.log('Loading admin page...');
}

export function AdminPage() {
  return (
    <div id="admin-page">
      <h1>Welcome Admin!</h1>
      <p>Your annoying clients made some <Link to="/requests">requests</Link> </p>
    </div>);
}
