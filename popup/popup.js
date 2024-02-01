// Access workspaces from Chrome storage
chrome.storage.sync.get({ workspaces: [] }, function (result) {
  const storedWorkspaces = result.workspaces;
  const template = document.getElementById("workspace_template");
  const elements = new Set();

  // Display all workspaces as buttons in the extensions popup
  for (const workspace of storedWorkspaces) {
    elements.add(displayWorkspace(workspace, template));
  }

  // Append the created workspace elements to a list for visibility
  document.querySelector("ul").append(...elements);
});

// Displays all workspaces within the popup
function displayWorkspace(workspace, template) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = workspace.title.trim();
  const groups = workspace.groups;

  const buttonElement = element.querySelector(".workspace_button");

  // Display button text as associated workspace
  buttonElement.innerText = title;

  // When button is clicked create the associated workspace
  buttonElement.addEventListener("click", async () => {createWorkspace(groups)});

  return element;
}

// Opens an associated workspace in Chrome
// @param {Array} groups - Array of workspace groups containing tabs
// Workspaces consist of Tab Groups and Tabs
async function createWorkspace(groups) {
  // Get all tabs in focused window for future deletion
  let currentTabs = [];
  await chrome.tabs.query({ currentWindow: true }, (tabs) => {
    currentTabs = tabs;
  });

  // Go through each indiviual group of the workspace creating their associated tabs
  for (const group of groups) {
    const tabIds = [];

    // Collect all tabs into array
    for (const tab of group.tabs) {
      const tabId = await chrome.tabs.create({url: tab});
      tabIds.push(tabId.id);
    }
    // Open tabs in tab group and update group to users settings
    var groupId = await chrome.tabs.group({tabIds: tabIds});
    chrome.tabGroups.update(groupId, { collapsed: true, title: group.title, color: "blue" });
  }

  // Clean out old tabs 
  chrome.tabs.remove(currentTabs.map(tab => tab.id));
};


  
