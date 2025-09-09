/**
 * Level 3: Persistent Expandable Tree
 * 
 * Requirements:
 * 
 * 1. Folders expand/collapse like Level 2.
 * 2. Preserve nested states when a parent is collapsed.
 * 3. Example: if Level 4 and 5 are open, closing Level 2 and reopening should restore Level 4/5 as open.
 * 4. Use a global expand state map keyed by node IDs instead of local state.
 * 
 * Learning Goals:
 * - Learn state lifting and how recursion works with a shared state store
 * - Understand the concept of persistent UI state
 * - Practice working with more complex state management patterns
 * 
 * Implementation Tips:
 * - Create a state object that maps folder IDs to their expanded state
 * - Lift this state to a common ancestor component
 * - Pass down state manipulation functions to child components
 * - Use context API if the component tree gets too deep
 */

// Example data structure you can use:
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
          id: "folder3",
          name: "Job Applications",
          type: "folder",
          children: [
            {
              id: "folder4",
              name: "Company A",
              type: "folder",
              children: [
                {
                  id: "file2",
                  name: "position-details.docx",
                  type: "file"
                }
              ]
            },
            {
              id: "folder5",
              name: "Company B",
              type: "folder",
              children: [
                {
                  id: "file3",
                  name: "application-status.txt",
                  type: "file"
                }
              ]
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
          id: "file4",
          name: "profile.jpg",
          type: "file"
        }
      ]
    }
  ]
};

// Example of expanded state structure:
const exampleExpandedState = {
  "root": true,
  "folder1": true,
  "folder3": true,
  "folder4": true,
  "folder5": false,
  "folder2": false
};
