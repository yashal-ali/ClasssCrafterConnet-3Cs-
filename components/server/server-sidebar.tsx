import { Classroom, ClassroomType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerHeader } from "./server-header";
// import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ClassroomType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ClassroomType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}

export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      classrooms: {
        orderBy: {
        //   createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  const textClassroom = server?.classrooms.filter((classrooms) => classrooms.type === ClassroomType.TEXT)
  const audioClassroom = server?.classrooms.filter((classrooms) => classrooms.type === ClassroomType.AUDIO)
 
  const members = server?.members.filter((member) => member.profileId !== profile.id)

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] ml-[72px]">
      <ServerHeader
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          {/* <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textClassroom?.map((classrooms) => ({
                  id: classrooms.id,
                  name: classrooms.name,
                  icon: iconMap[classrooms.type],
                }))
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioClassroom?.map((classrooms) => ({
                  id: classrooms.id,
                  name: classrooms.name,
                  icon: iconMap[classrooms.type],
                }))
              },
          
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                }))
              },
            ]}
          /> */}
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textClassroom?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="classrooms"
              classroomType={ClassroomType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textClassroom.map((classrooms) => (
                <ServerChannel
                  key={classrooms.id}
                  channel={classrooms}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioClassroom?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="classrooms"
             classroomType={ClassroomType.AUDIO}
              role={role}
              label="Voice Classroom"
            />
            <div className="space-y-[2px]">
              {audioClassroom.map((classrooms) => (
                <ServerChannel
                  key={classrooms.id}
                  channel={classrooms}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}