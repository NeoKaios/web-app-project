import { Request, Response } from "express";


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