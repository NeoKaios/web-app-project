import { Request, Response } from "express";
import sessions from "./consts";


export function reqsCheckIfAdmin(req: Request, res: Response){
    const admin_token = req.query.admin_token
    console.log(admin_token);
    if (admin_token=="V3ry_5eCr3t_t0keN"){
        res.status(200);
    }else{
        res.status(403);
    }
    return res.send();
}

export function storeRequest(req: Request, res: Response){
    const requestToAdd = req.query.req_url
    if (typeof requestToAdd === "string"){
        console.log(requestToAdd)
        sessions.push(requestToAdd)
        console.log(sessions)
    }
}

export function fetchRequests(req: Request, res: Response){
    console.log(sessions)
    res.json(sessions)
    return res;
}