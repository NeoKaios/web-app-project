import { Button } from "@mui/material";
import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import logo from "../assets/app-logo.png";
import { getToken, login, logout } from "../lib/auth";
import './root.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { getCookie } from "../lib/cookie";
import { ADMIN_TOKEN_COOKIE } from "../lib/consts";

export function Root() {
  const navigation = useNavigation()
  const navigate = useNavigate()
  const loggedIn = getToken() !== undefined;
  const adminLoggedIn = getCookie(ADMIN_TOKEN_COOKIE) !== undefined;
  return (
    <>
      <header className={'header' + (navigation.state === 'loading' ? ' loading' : '')}>
        <Link className="href-logo" to='/home'>
          <img src={logo} className="logo" alt="App logo" />
          <h2>Song Trainer</h2>
        </Link>
        <div>
          {loggedIn ?
            <>
              {!adminLoggedIn ?
                <Button color="inherit"
                  aria-label="logout"
                  className="log-btn"
                  onClick={() => navigate('/login')}>
                  <p>Login as Admin&nbsp;</p>
                </Button>
                : <Button color="inherit"
                  aria-label="logout"
                  className="log-btn"
                  onClick={() => navigate('/requests')}>
                  <p>Go to requests&nbsp;</p>
                </Button>
              }
              <Button color="inherit"
                aria-label="logout"
                className="log-btn"
                onClick={logout}>
                <p>Logout &nbsp;</p>
                <LogoutIcon className="back-icon" />
              </Button>
            </>
            : <Button
              color="inherit"
              aria-label="login"
              className="log-btn"
              onClick={login}>
              <p>Login with Spotify </p>
              <LoginIcon />
            </Button>
          }
        </div>
      </header>
      <div className="root-container">
        <div className="page-container">
          <Outlet />
        </div>
        <div className="area" >
          <ul className="circles">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => <li key={idx}></li>)}
          </ul>
        </div >

      </div>
    </>);
};

