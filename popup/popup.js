//create list of workspaces
const workspaces = [
    {title: "COMP 1805", 
    tabs: ["https://brightspace.carleton.ca/d2l/home/234943", 
    "https://docs.google.com/document/d/1J530dmHuQhE4BAWQhGftIn1V3AAEs-b47jLnXIw7Hcg/edit#heading=h.hcmv2u9u7zze"]},
    {title: "CLCV 1002", tabs: ["https://brightspace.carleton.ca/d2l/home/220841", 
    "https://docs.google.com/document/d/1dY6oHAaxK0V68atQ6qEjnlZNUSD7gbhYzRoBHIhJk8E/edit#heading=h.hcmv2u9u7zze"]}
];

const template = document.getElementById("workspace_template");
const elements = new Set();
for (const workspace of workspaces) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = workspace.title.trim();
  const tabs = workspace.tabs;

  const buttonElement = element.querySelector(".workspace_button")

  buttonElement.innerText = title;
  buttonElement.addEventListener("click", async () => {
    // need to focus window as well as the active tab
    for (const tab of tabs) {
        await chrome.tabs.create({ url: tab });
    }
  });
  elements.add(element);
}

document.querySelector("ul").append(...elements);