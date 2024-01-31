// options.js
document.addEventListener('DOMContentLoaded', function () {
  // Retrieve existing workspaces from storage and display them
  document.querySelector(".add_button").addEventListener("click", async () => {
      addWorkspace();
    });
    document.querySelector(".group_button").addEventListener("click", async () => {
      addGroup();
    });
  chrome.storage.sync.get({ workspaces: [] }, function (result) {
    const existingWorkspaces = result.workspaces;
    displayWorkspaces(existingWorkspaces);
  });
});
 
function addGroup() {
  const template = document.getElementById("group_template");
  const element = template.content.firstElementChild.cloneNode(true);
  element.querySelector(".tab_button").addEventListener("click", async () => {
    addTabInput(element.querySelector(".tabsContainer"));
  });
  document.querySelector("ol").append(element)
}

function addTabInput(tabsContainer) {
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
  const groups = [];
  for(const groupContainer of Array.from(document.querySelectorAll('.GroupContainer'))) {
    const group = {
      tabs: Array.from(groupContainer.querySelectorAll('.tabUrl')).map(input => input.value.trim())
    };
    groups.push(group);
  }
  
  // Validate input
  if (!title) {
    alert('Please fill in all fields');
    return;
  }

  // Create workspace objectAA
  const newWorkspace = {
    title: title,
    groups: groups,
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



  