import logo from "./assets/logo.svg";
import "./App.scss";
import { PlaylistList } from "./components";
import { getCookie, removeCookie } from "./lib/cookie";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./lib/consts";

function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}

function App() {
  const access_token = getCookie(ACCESS_TOKEN_COOKIE);
  const logged = access_token !== undefined;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {logged ? (
          <a href="http://localhost:3000/" onClick={logout}>Log out</a>
        ) : (
          <a href="http://localhost:4000/login">Login</a>
        )}
        {logged ? <PlaylistList></PlaylistList> : null}
      </header>
    </div>
  );
}

export default App;
