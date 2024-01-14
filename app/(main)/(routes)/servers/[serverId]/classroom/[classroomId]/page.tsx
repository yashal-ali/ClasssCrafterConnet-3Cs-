import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {ClassroomType } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { db } from "@/lib/db";

interface ClassroomIdPageProps {
  params: {
    serverId: string;
    classroomId: string;
  }
}

const ClassroomIdPage = async ({
  params
}: ClassroomIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const classroom = await db.classroom.findUnique({
    where: {
      id: params.classroomId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    }
  });

  if (!classroom || !member) {
    redirect("/");
  }

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={classroom.name}
        serverId={classroom.serverId}
        type="classroom"
      />
      {classroom.type === ClassroomType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={classroom.name}
            chatId={classroom.id}
            type="classroom"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: classroom.id,
              serverId:classroom.serverId,
            }}
            paramKey="classroomId"
            paramValue={classroom.id}
          />
          <ChatInput
            name={classroom.name}
            type="classroom"
            apiUrl="/api/socket/messages"
            query={{
              classroomId: classroom.id,
              serverId:classroom.serverId,
            }}
          />
        </>
      )}
      {classroom.type === ClassroomType.AUDIO && (
        <MediaRoom
          chatId={classroom.id}
          video={false}
          audio={true}
        />
      )}
    </div>
   );
}
 
export default ClassroomIdPage