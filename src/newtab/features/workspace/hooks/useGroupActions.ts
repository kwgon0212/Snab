import { useWorkspaceStore } from "@/newtab/store/workspace";
import { WorkspaceGroup } from "@/newtab/types/workspace";

export const useGroupActions = () => {
  const { activeWorkspace, updateWorkspace } = useWorkspaceStore();

  const handleEditGroupName = (group: WorkspaceGroup, newName: string) => {
    if (!activeWorkspace) return;
    
    let trimmedName = newName.trim();
    if (trimmedName.length > 20) {
      alert("그룹 이름은 20자 이하로 입력해주세요.");
      trimmedName = trimmedName.slice(0, 20);
    }

    if (trimmedName && trimmedName !== group.name) {
      const updatedGroups = activeWorkspace.groups.map((g) =>
        g.id === group.id ? { ...g, name: trimmedName } : g
      );

      updateWorkspace(activeWorkspace.id, {
        groups: updatedGroups,
      });
    }
  };

  const handleOpenGroup = async (group: WorkspaceGroup) => {
    if (!group.tabs.length) {
      alert("탭이 없습니다");
      return;
    }
    const newWindow = await chrome.windows.create({});
    if (newWindow && newWindow.id) {
      await chrome.tabs.create({
        windowId: newWindow.id,
        url: group.tabs[0].url,
      });

      for (let i = 1; i < group.tabs.length; i++) {
        await chrome.tabs.create({
          windowId: newWindow.id,
          url: group.tabs[i].url,
        });
      }
    }
  };

  const handleDeleteGroup = (group: WorkspaceGroup) => {
    const result = confirm(`[${group.name}] 그룹을 삭제하시겠습니까?`);
    if (!result) return;
    updateWorkspace(activeWorkspace?.id || "", {
      groups: activeWorkspace?.groups.filter((g) => g.id !== group.id) || [],
    });
  };

  return {
    handleEditGroupName,
    handleOpenGroup,
    handleDeleteGroup,
  };
};
