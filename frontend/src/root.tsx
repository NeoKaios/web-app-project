import { Button } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAuth } from "./components";
import logo from "./assets/logo.svg";
import './root.scss';

export function Root() {
  const auth = useAuth();
  const loggedIn = auth.token !== '';
  return (
    <>
      <header className='header'>
        <img src={logo} className="logo" alt="App logo" />
        <h1>Spotify BlindTest Learner</h1>
        <div>
        {loggedIn ?
          <Button className="log-btn" variant="contained" onClick={auth.logout}>Log out</Button>
          : <Button className="log-btn" variant="contained" onClick={auth.loginAction}>Login</Button>
        }
        <button onClick={auth.refreshToken} >Rfefre</button>
        <button onClick={auth.setOld} >Old</button>
        </div>
      </header>
      <Outlet />
    </>);
};

