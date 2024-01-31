// Access workspaces from Chrome storage
chrome.storage.sync.get({ workspaces: [] }, function (result) {
    // chrome.storage.sync.clear();
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
        console.log("Button clicked");
        console.log(groups.length);
        for (const group of groups) {
          // Create a Tab Group for each group
          const tabIds = [];
          // Open tabs in the Tab Group
          for (const tab of group.tabs) {
            const ba = await chrome.tabs.create({ url: tab });
            tabIds.push(ba.id);
          }
          var groupId = await chrome.tabs.group({tabIds: tabIds});
          chrome.tabGroups.update(groupId, { collapsed: false, title: "title", color: "blue" });
        }
      });
  
      elements.add(element);
    }
  
    // Append the created elements to the list
    document.querySelector("ul").append(...elements);
  });
  