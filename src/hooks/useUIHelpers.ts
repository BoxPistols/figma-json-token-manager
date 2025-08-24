import { FlattenedToken } from '../types';

export function useUIHelpers() {
  const getGroupDisplayName = (groupName: string): string => {
    const displayNames: Record<string, string> = {
      color: 'Colors',
      borderColor: 'Border Colors',
      shadow: 'Shadows',
      typography: 'Typography',
      spacing: 'Spacing',
      size: 'Sizes',
      opacity: 'Opacity',
      borderRadius: 'Border Radius',
      breakpoint: 'Breakpoints',
      icon: 'Icons',
    };
    return (
      displayNames[groupName] ||
      groupName.charAt(0).toUpperCase() + groupName.slice(1)
    );
  };

  const toggleGroup = (
    groupName: string,
    collapsedGroups: Set<string>,
    setCollapsedGroups: (groups: Set<string>) => void
  ) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };

  const handleAccordionControl = (
    action: 'openAll' | 'closeAll' | 'selectOpen',
    filteredTokens: Record<string, FlattenedToken[]>,
    selectedTypes: Set<string>,
    setCollapsedGroups: (groups: Set<string>) => void
  ) => {
    const allGroupTypes = Object.keys(filteredTokens);

    switch (action) {
      case 'openAll':
        setCollapsedGroups(new Set());
        break;
      case 'closeAll':
        setCollapsedGroups(new Set(allGroupTypes));
        break;
      case 'selectOpen': {
        // Keep only groups that have search matches or selected types
        const groupsToKeep = allGroupTypes.filter(
          (type) => selectedTypes.size === 0 || selectedTypes.has(type)
        );
        const groupsToCollapse = allGroupTypes.filter(
          (type) => !groupsToKeep.includes(type)
        );
        setCollapsedGroups(new Set(groupsToCollapse));
        break;
      }
    }
  };

  const toggleTokenTypeSelection = (
    type: string,
    selectedTypes: Set<string>,
    setSelectedTypes: (types: Set<string>) => void
  ) => {
    const newSelected = new Set(selectedTypes);
    if (newSelected.has(type)) {
      newSelected.delete(type);
    } else {
      newSelected.add(type);
    }
    setSelectedTypes(newSelected);
  };

  const clearTokenTypeSelection = (
    setSelectedTypes: (types: Set<string>) => void
  ) => {
    setSelectedTypes(new Set());
  };

  const getFilteredTokensByType = (
    filteredTokens: Record<string, FlattenedToken[]>,
    selectedTypes: Set<string>
  ) => {
    if (selectedTypes.size === 0) {
      return filteredTokens;
    }
    return Object.fromEntries(
      Object.entries(filteredTokens).filter(([type]) => selectedTypes.has(type))
    );
  };

  return {
    getGroupDisplayName,
    toggleGroup,
    handleAccordionControl,
    toggleTokenTypeSelection,
    clearTokenTypeSelection,
    getFilteredTokensByType,
  };
}
