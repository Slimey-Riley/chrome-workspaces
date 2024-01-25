// options.js
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve existing workspaces from storage and display them
    document.querySelector(".add_button").addEventListener("click", async () => {
        addWorkspace();
      });
      document.querySelector(".tab_button").addEventListener("click", async () => {
        addTabInput();
      });
    chrome.storage.sync.get({ workspaces: [] }, function (result) {
      const existingWorkspaces = result.workspaces;
      displayWorkspaces(existingWorkspaces);
    });
  });
  
function addTabInput() {
  const tabsContainer = document.getElementById('tabsContainer');
  const newTabInput = document.createElement('div');
  newTabInput.classList.add('tabInput');

  const inputNumber = document.querySelectorAll('.tabInput').length + 1;
  newTabInput.innerHTML = `<label for="url${inputNumber}">Tab URL:</label>
    <input type="text" class="tabUrl" name="url${inputNumber}" required>`;

    tabsContainer.appendChild(newTabInput);
  }

  // Add workspace function for the options page
  function addWorkspace() {
    // Get user input
    const title = document.getElementById('title').value.trim();
    const tabUrls = Array.from(document.querySelectorAll('.tabUrl')).map(input => input.value.trim());
  
    // Validate input
    if (!title || tabUrls.some(url => !url)) {
      alert('Please fill in all fields');
      return;
    }
  
    // Create workspace object
    const newWorkspace = {
      title: title,
      tabs: tabUrls,
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
  
    // Remove added tab inputs
    const tabsContainer = document.getElementById('tabsContainer');
    while (tabsContainer.firstChild) {
      tabsContainer.removeChild(tabsContainer.firstChild);
    }
  
    // Add a new empty tab input
    addTabInput();
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

// Display workspaces function
function displayWorkspaces(workspaces) {
  const workspaceList = document.createElement('ul');

  workspaces.forEach(function (workspace) {
    const workspaceItem = document.createElement('li');
    const buttonElement = document.createElement('button');
    buttonElement.className = 'workspace_button';
    buttonElement.innerText = workspace.title;

    buttonElement.addEventListener("click", async () => {
      // Open tabs for the clicked workspace
      for (const tab of workspace.tabs) {
        await chrome.tabs.create({ url: tab });
      }
    });

    workspaceItem.appendChild(buttonElement);
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

  