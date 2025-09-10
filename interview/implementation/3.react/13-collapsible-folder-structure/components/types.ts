// Define the structure for a folder or file item
export interface TreeItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeItem[];
  itemCount?: number;
  fileType?: string; // For custom file icons (e.g., 'pdf', 'image', etc.)
}

// Props for the FolderStructure component
export interface FolderStructureProps {
  data: TreeItem[];
  onSelect?: (item: TreeItem) => void;
  selectedId?: string;
  className?: string;
}

// Props for the TreeNode component
export interface TreeNodeProps {
  item: TreeItem;
  level: number;
  onSelect?: (item: TreeItem) => void;
  selectedId?: string;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
}
