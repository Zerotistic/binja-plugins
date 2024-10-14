document.addEventListener('DOMContentLoaded', function () {
  
  // Helper to format date
  function formatDate(dateString) {
    return dateString.length === 8
      ? `${dateString.slice(0, 4)} ${dateString.slice(4, 6)} ${dateString.slice(6, 8)}`
      : dateString;
  }

  // Renders table rows based on data
  function renderTable(data) {
    tableBody.innerHTML = data.map(plugin => {
      const formattedDate = formatDate(plugin.last);
      const isOfficial = plugin.origin.toLowerCase() === 'official'; // Check if plugin is official
      const officialBadge = isOfficial ? '<span class="official-badge">Official</span>' : ''; // Add badge if official
  
      return `
        <tr class="${isOfficial ? 'official-plugin' : ''}">
          <td><a href="${plugin.url}" target="_blank">${plugin.name} (${plugin.author}) ${officialBadge}</a></td>
          <td>${plugin.desc}</td>
          <td>${plugin.tags.join(', ')}</td>
          <td>${plugin.src}</td>
          <td>${formattedDate}</td>
        </tr>
      `;
    }).join('');
  }

  // Filters table data based on search and selected filters
  function filterTable() {
    const searchInput = document.getElementById('search').value.toLowerCase();

    const selectedSources = getSelectedValues('.source-checkbox');
    const selectedCategories = getSelectedValues('.category-checkbox');
    const selectedOrigin = getSelectedValues('.origin-checkbox');

    const filteredData = tabledata.filter(plugin => {
      const matchesSearch = [plugin.name, plugin.desc].some(field =>
        field.toLowerCase().includes(searchInput)
      );
      const matchesSource = selectedSources.length === 0 || selectedSources.includes(plugin.src.toLowerCase());
      const matchesOrigin = selectedOrigin.length === 0 || selectedOrigin.includes(plugin.origin.toLowerCase());
      const matchesCategories = selectedCategories.length === 0 || selectedCategories.every(cat =>
        plugin.tags.map(tag => tag.toLowerCase()).includes(cat)
      );

      return matchesSearch && matchesSource && matchesCategories && matchesOrigin;
    });

    renderTable(filteredData);
    updateStats(filteredData);
  }

  // Helper to get selected checkbox values
  function getSelectedValues(selector) {
    return Array.from(document.querySelectorAll(`${selector}:checked`)).map(input => input.value.toLowerCase());
  }

  // Toggles visibility of content sections
  function toggleContent(button, content) {
    const isVisible = content.style.display === "block";
    document.querySelectorAll('.collapsible-content > div').forEach(div => div.style.display = "none");
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

    if (!isVisible) {
      content.style.display = "block";
      button.classList.add('active');
      collapsibleContent.style.display = "block";
    } else {
      collapsibleContent.style.display = "none";
    }
  }

  // Updates stats based on filtered plugins
  function updateStats(shownPlugins) {
    const sources = {}, categories = {};

    shownPlugins.forEach(plugin => {
      sources[plugin.src] = (sources[plugin.src] || 0) + 1;
      plugin.tags.forEach(cat => {
        categories[cat] = (categories[cat] || 0) + 1;
      });
    });

    statsContainer.innerHTML = `
      <p>Showing <strong>${shownPlugins.length}</strong> plugins:</p>
      <p>Languages: ${formatStats(sources)}</p>
      <p>Categories: ${formatStats(categories)}</p>
    `;
  }

  // Helper to format stats output
  function formatStats(stats) {
    return Object.entries(stats).map(([key, count]) => `${count} ${key}`).join(', ');
  }

  // Initialize elements and events
  const tableBody = document.getElementById('plugin-table-body');
  const infoBtn = document.getElementById('info-btn');
  const limitBtn = document.getElementById('limit-btn');
  const infoContent = document.getElementById('information-content');
  const limitContent = document.getElementById('limitations-content');
  const collapsibleContent = document.querySelector('.collapsible-content');
  const statsContainer = document.getElementById('stats-container');

  // Set initial state
  collapsibleContent.style.display = "none";

  // Attach event listeners
  infoBtn.addEventListener('click', () => toggleContent(infoBtn, infoContent));
  limitBtn.addEventListener('click', () => toggleContent(limitBtn, limitContent));
  document.getElementById('search').addEventListener('input', filterTable);
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.addEventListener('change', filterTable));

  document.getElementById('clear-filters').addEventListener('click', () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    filterTable();
  });

  // Initial table render
  updateStats(tabledata);
  renderTable(tabledata);
});
