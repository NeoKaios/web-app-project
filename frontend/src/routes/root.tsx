import { Button } from "@mui/material";
import { Link, Outlet, useNavigation } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";
import logo from "../assets/logo.svg";
import './root.scss';

export function Root() {
  const auth = useAuth();
  const navigation = useNavigation()
  const loggedIn = auth.token !== '';
  return (
    <>
      <header className={'header' + (navigation.state === 'loading' ? ' loading' : '')}>
        <img src={logo} className="logo" alt="App logo" />
        <h1>Spotify BlindTest Learner</h1>
        <div>
          {loggedIn ?
            <Button className="log-btn" variant="contained" onClick={auth.logout}>Log out</Button>
            : <Button className="log-btn" variant="contained" onClick={auth.loginAction}>Login</Button>
          }
          <Link to='/home'>HOME</Link>
          <button onClick={auth.refreshToken} >Rfefre</button>
          <button onClick={auth.setOld} >Old</button>
        </div>
      </header>
      <div className="root-container">
        <Outlet />
      </div>
    </>);
};

