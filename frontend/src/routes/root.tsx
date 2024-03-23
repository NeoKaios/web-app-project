import { Button } from "@mui/material";
import { Link, Outlet, useNavigation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { getToken, login, logout } from "../lib/auth";
import './root.scss';

export function Root() {
  const navigation = useNavigation()
  const loggedIn = getToken() !== undefined;
  return (
    <>
      <header className={'header' + (navigation.state === 'loading' ? ' loading' : '')}>
        <img src={logo} className="logo" alt="App logo" />
        <h1>Spotify BlindTest Learner</h1>
        <div>
          {loggedIn ?
            <Button className="log-btn" variant="contained" onClick={logout}>Log out</Button>
            : <Button className="log-btn" variant="contained" onClick={login}>Login</Button>
          }
          <Link to='/home'>HOME</Link>
        </div>
      </header>
      <div className="root-container">
        <Outlet />
      </div>
    </>);
};

