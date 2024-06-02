let timers = {};
let totalTimeByUrl = {};

async function getActiveTabUrl() {
  try {
    const regex = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/;
    const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
    const match = (activeTab[0].url).match(regex)
    if (match) {
      return `${match[2]}.${match[3]}`;
    } else {
      throw "Can't clear url";
    }
  } catch (error) {
    console.log(error);
  }
}

function startTimer(tabId) {
  let startTime = Date.now();
  timers[tabId] = setInterval(() => {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Convert milliseconds to seconds

    (async () => {
      const url = await getActiveTabUrl();

      // Update the total elapsed time for the URL
      totalTimeByUrl[url] = elapsedTime;

      console.log(`Total time for ${url}: ${totalTimeByUrl[url]} seconds`);
    })();
  }, 1000); // Check every second
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    startTimer(tabId);
  }
});

// Function to get the total time by URL
function getTotalTimeByURL() {
  return new Promise(resolve => {
    resolve(totalTimeByUrl);
  });
}

// Listen for a message from the popup script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTotalTimeByUrl") {
    getTotalTimeByURL().then(data => sendResponse({data}));
    return true; // Keeps the message channel open until sendResponse is called
  }
});

// Cleanup function to stop timers when the tab is removed
browser.tabs.onRemoved.addListener((tabId) => {
  clearInterval(timers[tabId]);
  delete timers[tabId];
});
