import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_TOKEN_COOKIE, BACK_URL, USER_TOKEN_COOKIE } from '../lib/consts';
import { setCookie } from '../lib/cookie';
import './login-page.scss';

export function LoginPage() {
  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleAdminLogin = async () => {
    const res = await fetch(BACK_URL + "locallogin?password=" + passwordRef.current?.value);
    const token = await res.json()
    if (token.success) {
      setCookie(ADMIN_TOKEN_COOKIE, token.token);
      navigate('/home');
    } else if (passwordRef.current) {
      passwordRef.current.value = '';
    }
  }

  const handleUserLogin = async () => {
    const res = await fetch(BACK_URL + "locallogin?userLogin=true");
    const token = await res.text()
    setCookie(USER_TOKEN_COOKIE, token);
    navigate('/home');
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
        <input ref={passwordRef} type="password" placeholder='Admin password' name="password" />
        <button type="submit" onClick={handleAdminLogin}>Login</button>
      </div>
    </div>
  );
}
