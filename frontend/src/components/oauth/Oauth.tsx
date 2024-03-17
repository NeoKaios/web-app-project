import { useEffect, useState } from 'react';
import { BACK_URL } from '../../lib/consts';
import { getAccessToken, getRefreshToken, setCookie } from '../../lib/cookie';
import { checkToken } from '../../lib/spotify-api';

export function Oauth({ onValidToken }: { onValidToken: (access_token: string) => void }) {
  const [access_token, setAccessToken] = useState(getAccessToken());
  const refresh_token = getRefreshToken();

  useEffect(() => {
    const fun = async () => {
      if (!access_token) return;
      const isValid = await checkToken(access_token);
      console.log("Token validity : ", isValid);
      if (isValid) {
        onValidToken(access_token);
      } else { // Invalid token : generate a new one
        const res = await fetch(BACK_URL + 'refresh_token?refresh_token=' + refresh_token);
        const new_access_token = await res.text();
        setCookie('access_token', new_access_token);
        setAccessToken(new_access_token);
      }
    };
    fun();
  }, [access_token, refresh_token, onValidToken]);

  return (<></>);
}

