// Access workspaces from Chrome storage
chrome.storage.sync.get({ workspaces: [] }, function (result) {
    const storedWorkspaces = result.workspaces;
    const template = document.getElementById("workspace_template");
    const elements = new Set();
  
    for (const workspace of storedWorkspaces) {
      const element = template.content.firstElementChild.cloneNode(true);
  
      const title = workspace.title.trim();
      const groups = workspace.groups;
  
      const buttonElement = element.querySelector(".workspace_button");

      // Set button text to workspace title
      buttonElement.innerText = title;
      buttonElement.addEventListener("click", async () => {
        let currentTabsList = [];
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
          currentTabsList = tabs;
        });
        for (const group of groups) {
          // Create a Tab Group for each group
          const tabIds = [];
          // Open tabs in the Tab Group
          for (const tab of group.tabs) {
            const tabId = await chrome.tabs.create({url: tab});
            tabIds.push(tabId.id);
          }
          var groupId = await chrome.tabs.group({tabIds: tabIds});
          chrome.tabGroups.update(groupId, { collapsed: false, title: "title", color: "blue" });
        }
        chrome.tabs.remove(currentTabsList.map(tab => tab.id));
      });
  
      elements.add(element);
    }
  
    // Append the created elements to the list
    document.querySelector("ul").append(...elements);
  });
  