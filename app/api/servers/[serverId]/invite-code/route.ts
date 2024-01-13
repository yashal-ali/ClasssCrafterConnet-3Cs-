import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import {v4 as uuid} from "uuid";
import { db } from "@/lib/db";
export async function PATCH(
    req:Request,
    {params}:{params:{serverId:string}},
){
    try{
        const profile=await currentProfile();
        if(!profile){
            return new NextResponse(null,{status:401});
        }
        if(!params.serverId){
            return new NextResponse(null,{status:400});
        }
        const server=await db.server.update({
            where:{
               id:params.serverId,
               profileId:profile.id,
            },
            data:{
                inviteCode:uuid(),
        }});
        return NextResponse.json(server);
}

catch(error){
    console.error(error);
    return new NextResponse("Internal Server Error", {status:500})
}}