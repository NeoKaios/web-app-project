import React from 'react';
import logo from './logo.svg';
import './App.scss';

function getHashParams() {
    var hashParams: any = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
                hashParams[e[1]] = decodeURIComponent(e[2]);
            }
            return hashParams;
        }

function App() {
    const params = getHashParams();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a href="http://localhost:4000/login">Login</a>
        <p>Access token: { params.access_token }</p>
        <p>Refresh token: { params.refresh_token }</p>
        <p>Error: { params.error }</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
