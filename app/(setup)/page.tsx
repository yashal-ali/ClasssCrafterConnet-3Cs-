
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";
const SetupPage = async () => {
  const profile = await initialProfile();
  console.log('profile :>> ', profile);
  if (profile) {
    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });
    console.log('server :>> ', profile);
    if (server) {
      return redirect(`/servers/${server.id}`)
    }
  }

  return (
    <div>
      <InitialModal/>
    </div>
  );
};

export default SetupPage;
