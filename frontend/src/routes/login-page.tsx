import { KeyboardEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, userLogin } from '../lib/backend-api';
import { ADMIN_TOKEN_COOKIE, USER_TOKEN_COOKIE } from '../lib/consts';
import { setCookie } from '../lib/cookie';
import './login-page.scss';

export function LoginPage() {
  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleAdminLogin = async () => {
    const token = await adminLogin(passwordRef.current?.value || '')
    if (token) {
      setCookie(ADMIN_TOKEN_COOKIE, token);
      navigate('/home');
    } else if (passwordRef.current) {
      passwordRef.current.value = '';
    }
  }

  const handleUserLogin = async () => {
    const token = await userLogin();
    setCookie(USER_TOKEN_COOKIE, token);
    navigate('/home');
  }

  const enterManager = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      handleAdminLogin();
    }
  }

  return (
    <div className="login-panel">
      <div className='user-login'>
        <h1>Login as a User :</h1>
        <button id="user-login-btn" onClick={handleUserLogin}>Login</button>
      </div>
      <hr />
      <div className='admin-login'>
        <h1>Login as an Admin :</h1>
        <input ref={passwordRef} type="password" placeholder='Admin password' name="password" onKeyUp={enterManager} />
        <button type="submit" onClick={handleAdminLogin}>Login</button>
      </div>
    </div>
  );
}
