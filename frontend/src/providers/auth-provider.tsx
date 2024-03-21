import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_COOKIE, BACK_URL, REFRESH_TOKEN_COOKIE } from "../lib/consts";
import { getCookie, removeCookie, setCookie } from "../lib/cookie";
import { SpotifyAPI } from "../lib/spotify-api";

const AuthContext = createContext<any>(null);

const loginAction = () => {
  window.location.href = BACK_URL + 'login';
};

export async function refreshTokenFn() {
    console.log('refreshing token');
    await new Promise(r => setTimeout(r, 2000));
    const refresh_token = getCookie(REFRESH_TOKEN_COOKIE);
    const res = await fetch(BACK_URL + 'refresh_token?refresh_token=' + refresh_token);
    console.log('REFRESHED token');
    const new_access_token = await res.text();
    setCookie('access_token', new_access_token);
    SpotifyAPI.setToken(new_access_token);
    return new_access_token;
  }

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState(getCookie(ACCESS_TOKEN_COOKIE) || "");
  const navigate = useNavigate();

  const logout = () => {
    removeCookie(ACCESS_TOKEN_COOKIE);
    removeCookie(REFRESH_TOKEN_COOKIE);
    setToken("");
    navigate("/");
  };

  const refreshToken = async () => {
    setToken(await refreshTokenFn());
  }

  const setOld = () => {
    const old = "BQB19FAQgqVUT-dAMDMElAAmStbckd6EMynOCp59XnQ3A7HCaWQ_SQNW-Qvas70h8y8FIPdlH_xDq4F1N3r5ARsenE5ZNiIOblrkIrF7UJh8Dx7VBXUg2EkPbS_mmsz9zL6Qx8h8DPrm_OG3_S_SKT-9_Y_TDqmwLfkveUk50EI6PiypbrelrURGv6F_z8thYjBEyQ";
    setToken(old)
    setCookie('access_token', old);
    SpotifyAPI.setToken(old);
  }

  console.log('Auth reloaded')

  const auth = { token, setOld, loginAction, logout, refreshToken };

  return (
    <AuthContext.Provider value={auth}>
      <div className="auth">
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
