import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_COOKIE, BACK_URL, REFRESH_TOKEN_COOKIE } from "../../lib/consts";
import { getAccessToken, getRefreshToken, removeCookie, setCookie } from "../../lib/cookie";

const AuthContext = createContext<any>(null);

const loginAction = () => {
  window.location.href = BACK_URL + 'login';
};

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState(getAccessToken() || "");
  const refresh_token = getRefreshToken();
  const navigate = useNavigate();

  if (token !== '') {
    localStorage.setItem("site", token);
  }

  const logout = () => {
    removeCookie(ACCESS_TOKEN_COOKIE);
    removeCookie(REFRESH_TOKEN_COOKIE);
    setToken("");
    localStorage.removeItem("site");
    navigate("/");
  };

  const refreshToken = async () => {
    const res = await fetch(BACK_URL + 'refresh_token?refresh_token=' + refresh_token);
    const new_access_token = await res.text();
    setCookie('access_token', new_access_token);
    setToken(new_access_token);
    localStorage.setItem('site', new_access_token)
  }

  const setOld = () => {
    const old = "BQB19FAQgqVUT-dAMDMElAAmStbckd6EMynOCp59XnQ3A7HCaWQ_SQNW-Qvas70h8y8FIPdlH_xDq4F1N3r5ARsenE5ZNiIOblrkIrF7UJh8Dx7VBXUg2EkPbS_mmsz9zL6Qx8h8DPrm_OG3_S_SKT-9_Y_TDqmwLfkveUk50EI6PiypbrelrURGv6F_z8thYjBEyQ";
    setToken(old)
    setCookie('access_token', old);
  }

  console.log('Auth reloaded')

  return (
    <AuthContext.Provider value={{ token, setOld, loginAction, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => {
  return useContext(AuthContext);
};
