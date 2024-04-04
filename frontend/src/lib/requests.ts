import { ADMIN_TOKEN_COOKIE, BACK_URL } from "./consts";
import { getCookie } from "./cookie";


export async function adminCheck() {
    console.log(getCookie(ADMIN_TOKEN_COOKIE))
    const response = await fetch(BACK_URL + 'checkadmin?admin_token=' + getCookie(ADMIN_TOKEN_COOKIE))
    //const response = await fetch(BACK_URL + 'checkadmin')
    console.log(response);
    return response.status == 200;
  }

export async function submitRequest(url : string){
    console.log(url)
    await fetch(BACK_URL + 'reqstore?req_url='+url)
    return;
}

export async function fetchRequests(){
    console.log("Fetching requests");
    const response = await fetch(BACK_URL + 'reqfetch')
    const data :string[] = await response.json();
    return data;
}