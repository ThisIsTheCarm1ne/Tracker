document.addEventListener('DOMContentLoaded', async () => {
  const statsTable = document.querySelector('#statsTable tbody');

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let formattedTime = '';
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes}m `;
    }
    formattedTime += `${remainingSeconds}s`;

    return formattedTime;
  }

  function updateTable(totalTimeData) {
    // Clear existing rows
    statsTable.innerHTML = '';

    const entries = Object.entries(totalTimeData).map(([key, value]) => ({
      website: key,
      totalTime: value
    }));

    // Sort by total time descending
    entries.sort((a, b) => b.totalTime - a.totalTime);

    // Populate the table
    entries.forEach(entry => {
      const row = document.createElement('tr');
      const formattedTime = formatTime(entry.totalTime);
      row.innerHTML = `<td>${entry.website}</td><td>${formattedTime}</td>`;
      statsTable.appendChild(row);
    });
  }

  function fetchAndUpdate() {
    browser.runtime.sendMessage({ action: "getTotalTimeByUrl" }, response => {
      updateTable(response.data);
    });
  }

  // Fetch and update the table every second
  setInterval(fetchAndUpdate, 1000);

  // Initial fetch to populate the table immediately
  fetchAndUpdate();
});
