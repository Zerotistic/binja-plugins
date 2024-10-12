document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('plugin-table-body');

    function formatDate(dateString) {
        if (dateString.length === 8) {
          const year = dateString.slice(0, 4);
          const month = dateString.slice(4, 6);
          const day = dateString.slice(6, 8);
          return `${year} ${month} ${day}`;
        }
        return dateString; // Return the original string if not in the expected format
    }

    function renderTable(data) {
      tableBody.innerHTML = '';
      data.forEach(plugin => {
        const formattedDate = formatDate(plugin.last);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><a href="${plugin.url}" target="_blank">${plugin.name} (${plugin.author})</a></td>
          <td>${plugin.desc}</td>
          <td>${plugin.tags}</td>
          <td>${plugin.src}</td>
          <td>${formattedDate}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    function filterTable() {
      const searchInput = document.getElementById('search').value.toLowerCase();
      
      // Get selected sources and categories
      const selectedSources = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(input => input.id === "c++" || input.id === "python")
        .map(input => input.value.toLowerCase());

      const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(input => input.id !== "c++" && input.id !== "python")
        .map(input => input.value.toLowerCase());
  
      const filteredData = tabledata.filter(plugin => {
        // Match search term
        const matchesSearch = plugin.name.toLowerCase().includes(searchInput) || plugin.desc.toLowerCase().includes(searchInput);
        
        // Match source (if any selected)
        const matchesSource = selectedSources.length === 0 || selectedSources.includes(plugin.src.toLowerCase());
  
        // Match categories (if any selected)
        const pluginCategories = plugin.tags.map(tag => tag.toLowerCase());
        const matchesCategories = selectedCategories.length === 0 || selectedCategories.every(cat => pluginCategories.includes(cat));
  
        return matchesSearch && matchesSource && matchesCategories;
      });
  
      renderTable(filteredData);
    }
  
    const button = document.querySelector('.collapsible-btn');
    const content = document.querySelector('.collapsible-content');

    button.addEventListener('click', function () {
        button.classList.toggle('active');

        if (content.style.display === "block") {
            content.style.display = "none";
            button.innerHTML = 'Limitations &#9660;';  
        } else {
            content.style.display = "block";
            button.innerHTML = 'Limitations &#9650;'; 
        }
    });

    renderTable(tabledata);
  
    document.getElementById('search').addEventListener('input', filterTable);
  
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', filterTable);
    });
  
    document.getElementById('clear-filters').addEventListener('click', function() {
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
      filterTable();
    });
});
  