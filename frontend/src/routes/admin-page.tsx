import { adminCheck } from '../lib/requests';
import './admin-page.scss';
import { Link, useLoaderData } from "react-router-dom";

export async function adminLoader() {
    console.log('Loading admin page...');
    return await adminCheck();
  }

export function AdminPage() {
    const isAdmin = useLoaderData() as Awaited<ReturnType<typeof adminLoader>>;
  if (isAdmin){
    return (
        <div id="admin-page">
        <h1>Welcome Admin!</h1>
        <p>Your annoying clients made some <Link to="/requests">requests</Link> </p>
        </div>);
  }else{
    return (
        <div id="admin-page">
        <h1>Hey! You are not an admin !</h1>
        <p> Get back to your place, you filthy low socio-economic peasant ! </p>
        </div>);
  }
}
