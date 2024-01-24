// options.js
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve existing workspaces from storage and display them
    document.querySelector(".add_button").addEventListener("click", async () => {
        addWorkspace();
      });
    chrome.storage.sync.get({ workspaces: [] }, function (result) {
      const existingWorkspaces = result.workspaces;
      displayWorkspaces(existingWorkspaces);
    });
  });
  
  function addWorkspace() {
    // Get user input
    const title = document.getElementById('title').value.trim();
    const url1 = document.getElementById('url1').value.trim();
    const url2 = document.getElementById('url2').value.trim();
  
    // Validate input
    if (!title || !url1 || !url2) {
      alert('Please fill in all fields');
      return;
    }
  
    // Create workspace object
    const newWorkspace = {
      title: title,
      tabs: [url1, url2],
    };
  
    // Retrieve existing workspaces from storage
    chrome.storage.sync.get({ workspaces: [] }, function (result) {
      const existingWorkspaces = result.workspaces;
  
      // Add the new workspace
      existingWorkspaces.push(newWorkspace);
  
      // Save updated workspaces to storage
      chrome.storage.sync.set({ workspaces: existingWorkspaces }, function () {
        // Display updated workspaces
        displayWorkspaces(existingWorkspaces);
      });
    });
  
    // Clear input fields
    document.getElementById('title').value = '';
    document.getElementById('url1').value = '';
    document.getElementById('url2').value = '';
  }
  
  function displayWorkspaces(workspaces) {
    // Display existing workspaces in a list or any other way you prefer
    const workspaceList = document.createElement('ul');
    workspaces.forEach(function (workspace) {
      const workspaceItem = document.createElement('li');
      workspaceItem.textContent = workspace.title;
      workspaceList.appendChild(workspaceItem);
    });
  
    // Replace the content of the options page with the updated workspace list
    const existingList = document.querySelector('ul');
    if (existingList) {
      document.body.replaceChild(workspaceList, existingList);
    } else {
      document.body.appendChild(workspaceList);
    }
  }
  