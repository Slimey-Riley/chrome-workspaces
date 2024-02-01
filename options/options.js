// Loads relevent content
document.addEventListener('DOMContentLoaded', function () {
  initialisePage();
});

// Creates a new input area for adding a group
function addGroup() {
  const template = document.getElementById("group_template");
  const element = template.content.firstElementChild.cloneNode(true);
  element.querySelector(".tab_button").addEventListener("click", async () => {
    addTabInput(element.querySelector(".tabsContainer"));
  });
  document.querySelector("ol").append(element)
}

// Creates a new input area for adding a tab
function addTabInput(tabsContainer) {
  const newTabInput = document.createElement('div');
  newTabInput.classList.add('tabInput');

  // Track tab number
  const inputNumber = document.querySelectorAll('.tabInput').length + 1;
  newTabInput.innerHTML = `<label for="url${inputNumber}">Tab URL:</label>
    <input type="text" class="tabUrl" name="url${inputNumber}" required>`;
  tabsContainer.appendChild(newTabInput);
}

// Add workspace function for the options page
async function addWorkspace() {
  // Get user input
  const title = document.getElementById('title').value.trim();

  // Collect all the groups into an array
  const groups = [];
  for(const groupContainer of Array.from(document.querySelectorAll('.GroupContainer'))) {
    // Create new group object
    const group = {
      tabs: Array.from(groupContainer.querySelectorAll('.tabUrl')).map(input => input.value.trim()),
      title: groupContainer.querySelector('.group_title').value.trim()
    };
    groups.push(group);
  }
  
  // Validate input
  if (!title) {
    alert('Please fill in title field');
    return;
  }

  // Create workspace object
  const newWorkspace = {
    title: title,
    groups: groups,
  };

  // Retrieve existing workspaces from storage and save
  await chrome.storage.sync.get({ workspaces: [] }, function (result) {
    const existingWorkspaces = result.workspaces;
    existingWorkspaces.push(newWorkspace);

    // Save updated workspaces to storage
    chrome.storage.sync.set({ workspaces: existingWorkspaces });
  });
  
  // Clean page
  this.location.reload();
}

// Initilises the page
async function initialisePage() {
  // Initialise all buttons
  document.querySelector(".add_button").addEventListener("click", async () => {
    addWorkspace();
  });
  document.querySelector(".group_button").addEventListener("click", async () => {
    addGroup();
  });
  document.querySelector(".reset_button").addEventListener("click", async () => {
    await chrome.storage.sync.clear();
    this.location.reload();
  });

  // Display existing workspaces
  await chrome.storage.sync.get({ workspaces: [] }, function (result) {
    const existingWorkspaces = result.workspaces;
    displayWorkspaces(existingWorkspaces);
  });
}

// Displays specified workspaces
function displayWorkspaces(workspaces) {
  // Display existing workspaces in a list
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



  