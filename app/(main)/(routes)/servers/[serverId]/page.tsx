
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
  params: {
    serverId: string;
  }
};

const ServerIdPage = async ({
  params
}: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      classrooms: {
        where: {
          name: "general"
        },
        // orderBy: {
        //   createdAt: "asc"
        // }
      }
    }
  })

  const initialClassroom = server?.classrooms[0];

  if (initialClassroom?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/classroom/${initialClassroom?.id}`)
}
 
export default ServerIdPage;