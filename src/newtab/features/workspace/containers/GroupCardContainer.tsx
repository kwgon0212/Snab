import { useWorkspaceStore } from "@/newtab/store/workspace";
import { WorkspaceGroup } from "@/newtab/types/workspace";
import GroupCard from "../components/GroupCard";
import { useGroupActions } from "../hooks/useGroupActions";

interface GroupCardContainerProps {
  group: WorkspaceGroup;
  tabViewMode: 1 | 2 | 3;
}

const GroupCardContainer = ({ group, tabViewMode }: GroupCardContainerProps) => {
  const { activeWorkspace } = useWorkspaceStore();
  const { handleEditGroupName, handleDeleteGroup, handleOpenGroup } = useGroupActions();

  if (!activeWorkspace) return null;

  return (
    <GroupCard
      group={group}
      workspaceId={activeWorkspace.id}
      tabViewMode={tabViewMode}
      onRename={handleEditGroupName}
      onDelete={handleDeleteGroup}
      onOpenWindow={handleOpenGroup}
    />
  );
};

export default GroupCardContainer;
