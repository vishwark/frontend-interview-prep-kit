/**
 * Level 7: Searchable Tree
 * 
 * Requirements:
 * 
 * 1. Add a search input.
 * 2. Highlight matching items.
 * 3. Auto-expand folders that contain matches.
 * 
 * Learning Goals:
 * - Learn how to implement search functionality in a tree structure
 * - Understand how to highlight matching content
 * - Practice conditional rendering based on search state
 * - Learn how to traverse and filter tree structures
 * 
 * Implementation Tips:
 * - Create a search input component with controlled state
 * - Implement a recursive search function that traverses the tree
 * - Track which nodes match the search query
 * - Auto-expand folders that contain matching descendants
 * - Add visual highlighting for matching nodes
 * - Consider debouncing the search for better performance
 */

// Example data structure:
const exampleFileSystem = {
  id: "root",
  name: "Root",
  type: "folder",
  children: [
    {
      id: "folder1",
      name: "Documents",
      type: "folder",
      children: [
        {
          id: "file1",
          name: "resume.pdf",
          type: "file"
        },
        {
          id: "file2",
          name: "cover-letter.docx",
          type: "file"
        },
        {
          id: "folder3",
          name: "Project Reports",
          type: "folder",
          children: [
            {
              id: "file3",
              name: "q1-report.pdf",
              type: "file"
            },
            {
              id: "file4",
              name: "q2-report.pdf",
              type: "file"
            }
          ]
        }
      ]
    },
    {
      id: "folder2",
      name: "Images",
      type: "folder",
      children: [
        {
          id: "file5",
          name: "profile.jpg",
          type: "file"
        },
        {
          id: "file6",
          name: "vacation.png",
          type: "file"
        }
      ]
    }
  ]
};

// Example search function:
function searchFileSystem(tree, searchTerm) {
  // Convert search term to lowercase for case-insensitive matching
  const term = searchTerm.toLowerCase();
  
  // Recursive function to search the tree
  function searchNode(node, path = []) {
    // Check if the current node matches
    const nodeName = node.name.toLowerCase();
    const isMatch = nodeName.includes(term);
    
    // For folders, also check children
    if (node.type === 'folder' && node.children) {
      // Search all children
      const childMatches = node.children.flatMap(child => 
        searchNode(child, [...path, node.id])
      );
      
      // If any children match, this folder should be in the results
      // and should be auto-expanded
      if (childMatches.length > 0) {
        return [
          // Include this folder in the path to matches
          { id: node.id, name: node.name, type: node.type, isMatch, path },
          ...childMatches
        ];
      }
    }
    
    // Return this node if it matches
    return isMatch ? [{ id: node.id, name: node.name, type: node.type, isMatch, path }] : [];
  }
  
  // Start the search from the root
  return searchNode(tree);
}

// Example of how to use the search results:
function getExpandedFolders(searchResults) {
  // Collect all folder IDs that should be expanded
  const expandedFolders = new Set();
  
  // For each result, add all folders in its path to the set
  searchResults.forEach(result => {
    result.path.forEach(folderId => {
      expandedFolders.add(folderId);
    });
  });
  
  return expandedFolders;
}

// Example component usage:
function SearchableFileExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  
  // Update search results when search term changes
  useEffect(() => {
    if (searchTerm) {
      const results = searchFileSystem(exampleFileSystem, searchTerm);
      setSearchResults(results);
      setExpandedFolders(getExpandedFolders(results));
    } else {
      setSearchResults([]);
      // Reset to default expanded state
      setExpandedFolders(new Set(['root']));
    }
  }, [searchTerm]);
  
  // Render function would use searchResults and expandedFolders
  // to display the tree with highlighting and auto-expansion
}
