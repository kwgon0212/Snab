import { useTranslation } from "react-i18next";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useWorkspaceStore } from "@/newtab/store/workspace";
import { Workspace } from "@/newtab/types/workspace";

interface SidebarContainerProps {
  width: number;
}

const SidebarContainer = ({ width }: SidebarContainerProps) => {
  const { t } = useTranslation();
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    addWorkspace,
    deleteWorkspace,
  } = useWorkspaceStore();

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleAddWorkspace = () => {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name: t("common.defaultWorkspace"),
      groups: [],
      createdAt: new Date().toISOString(),
      groupViewMode: 1,
      tabViewMode: 1,
    };
    addWorkspace(workspace);
  };

  const handleDeleteWorkspace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteWorkspace(id);
  };

  const handleCloseDonation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDonationModal(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <Sidebar
      width={width}
      workspaces={workspaces}
      activeWorkspaceId={activeWorkspace?.id}
      showDonationModal={showDonationModal}
      isClosing={isClosing}
      onAddWorkspace={handleAddWorkspace}
      onDeleteWorkspace={handleDeleteWorkspace}
      onSelectWorkspace={setActiveWorkspace}
      onCloseDonation={handleCloseDonation}
      onOpenDonation={() => setShowDonationModal(true)}
    />
  );
};

export default SidebarContainer;
