"use client"
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect,useState } from "react";
import { InviteModal } from "../modals/invite-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateClassroomModal } from "../modals/create-classroom-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { DeleteClassroomModal } from "../modals/delete-classroom-modal";
import { EditClassroomModal } from "../modals/edit-classroom-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    },[])
    if (!isMounted) return null;
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateClassroomModal/>
      <LeaveServerModal/>
      <DeleteServerModal/>
      <DeleteClassroomModal/>
      <EditClassroomModal/>
    </>
  );
};