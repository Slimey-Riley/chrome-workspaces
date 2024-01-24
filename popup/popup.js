// Access workspaces from Chrome storage
chrome.storage.sync.get({ workspaces: [] }, function (result) {
    const storedWorkspaces = result.workspaces;
  
    const template = document.getElementById("workspace_template");
    const elements = new Set();
  
    for (const workspace of storedWorkspaces) {
      const element = template.content.firstElementChild.cloneNode(true);
  
      const title = workspace.title.trim();
      const tabs = workspace.tabs;
  
      const buttonElement = element.querySelector(".workspace_button");
  
      // Set button text to workspace title
      buttonElement.innerText = title;
  
      buttonElement.addEventListener("click", async () => {
        // Open tabs for the clicked workspace
        for (const tab of tabs) {
          await chrome.tabs.create({ url: tab });
        }
      });
  
      elements.add(element);
    }
  
    // Append the created elements to the list
    document.querySelector("ul").append(...elements);
  });
  