document.addEventListener('DOMContentLoaded', async () => {
  const statsTable = document.getElementById('statsTable');

  // Request the total time by URL from the background script
  await browser.runtime.sendMessage({action: "getTotalTimeByUrl"}, response => {
    const totalTimeData = response.data;
    const entries = Object.entries(totalTimeData).map(([key, value]) => ({
      website: key,
      totalTime: value
    }));
    console.log(entries);

    // Sort by total time descending
    entries.sort((a, b) => b.totalTime - a.totalTime);

    // Populate the table
    entries.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${entry.website}</td><td>${entry.totalTime} seconds</td>`;
      statsTable.appendChild(row);
    });
  });
});
