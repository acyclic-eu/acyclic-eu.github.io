let cvData = null;
let filteredCvData = null;
let tagFilteredCvData = null;

fetch('/cv/cv.json')
  .then(response => response.json())
  .then(data => {
    cvData = data;
    tagFilteredCvData = filterTagCvData();
    updateMaxYears();
    onFilterChange();
  })
  .catch(err => console.error('Failed to load cv.json', err));

function getMaxYearsFromTagFilteredCvData() {
  if (!tagFilteredCvData || !tagFilteredCvData.experiences || tagFilteredCvData.experiences.length === 0) return 1;
  const years = tagFilteredCvData.experiences
    .map(exp => exp.start_date)
    .filter(Boolean)
    .map(dateStr => {
      const year = parseInt(dateStr?.slice(0, 4), 10);
      return isNaN(year) ? null : year;
    })
    .filter(year => year !== null);
  if (years.length === 0) return 1;
  const currentYear = new Date().getFullYear();
  const earliestYear = Math.min(...years);
  return currentYear - earliestYear + 1;
}

function updateMaxYears() {
  const maxYears = getMaxYearsFromTagFilteredCvData();
  const timeFilter = document.getElementById('experience-filter');
  if (timeFilter) {
    timeFilter.max = maxYears;
  }
}

function passesTagFiltering(tagsAttr, selectedTags) {
  var tags = tagsAttr ? decodeURIComponent(tagsAttr).split(',').map(tag => tag.trim()) : [];
  if (!tags.length) {
    return true;
  }
  if (selectedTags.length === 0) {
    return false;
  }
  return tags.some(tag => selectedTags.includes(tag));
}

function parseDate(dateStr, fallback) {
  if (!dateStr || dateStr === "Present") return new Date(8640000000000000);
  const d = new Date(dateStr);
  return isNaN(d) ? fallback : d;
}

function sortByDateDesc(a, b) {
  const aEnd = parseDate(a.end_date, new Date(0));
  const bEnd = parseDate(b.end_date, new Date(0));
  if (bEnd - aEnd !== 0) return bEnd - aEnd;
  const aStart = parseDate(a.start_date, new Date(0));
  const bStart = parseDate(b.start_date, new Date(0));
  return bStart - aStart;
}

function filterTagCvData() {
  if (!cvData) return null;
  const selectedTags = Array.from(document.querySelectorAll('#cv-tags-form tag-toggle'))
    .filter(toggle => toggle.checked)
    .map(toggle => toggle.name.trim());

  return {
    ...cvData,
    experiences: cvData.experiences
      .filter(exp => passesTagFiltering(exp.tags, selectedTags))
      .sort(sortByDateDesc)
      .map(exp => ({
        ...exp,
        descriptions: (exp.descriptions || []).filter(desc => passesTagFiltering(desc.tags, selectedTags))
      }))
  };
}

function filterCvData() {
  if (!cvData) return null;
  const selectedTags = Array.from(document.querySelectorAll('#cv-tags-form tag-toggle'))
    .filter(toggle => toggle.checked)
    .map(toggle => toggle.name.trim());
  const yearDepth = parseInt(document.getElementById('experience-filter')?.value || '0', 10);
  const today = new Date();
  const cutoffYear = today.getFullYear() - yearDepth;
  const cutoffDate = new Date(cutoffYear, today.getMonth(), today.getDate());

  return {
    ...cvData,
    experiences: cvData.experiences
      .filter(exp => {
        let isCurrent = exp.end_date === "Present" || !exp.end_date;
        let endDateObj = isCurrent ? today : new Date(exp.end_date);
        let passesDate = yearDepth === 0 ? isCurrent : (isCurrent || endDateObj >= cutoffDate);
        if (!passesDate) return false;
        return passesTagFiltering(exp.tags, selectedTags);
      })
      .sort(sortByDateDesc)
      .map(exp => ({
        ...exp,
        descriptions: (exp.descriptions || []).filter(desc => passesTagFiltering(desc.tags, selectedTags))
      }))
  };
}

function renderCvContent() {
  const container = document.getElementById('cv-content');
  if (!container) return;
  if (!filteredCvData || !filteredCvData.experiences) {
    container.innerHTML = '<em>No experiences to display.</em>';
    return;
  }
  container.innerHTML = filteredCvData.experiences.map(exp => {
    const traits = exp.traits ? exp.traits.join(', ') : '';
    const tags = exp.tags ? exp.tags.join(',') : '';
    const employmentType = exp.employment_type || 'Employed';
    const endDate = exp.end_date || 'Present';
    return `
      <cv-experience
        title="${exp.title}"
        company="${exp.company}"
        traits="${traits}"
        location="${exp.location || 'N/A'}"
        start-date="${exp.start_date || 'N/A'}"
        end-date="${endDate}"
        employment-type="${employmentType}"
        exp-tags="${encodeURIComponent(tags)}"
        descriptions="${JSON.stringify(exp.descriptions.map((desc) => desc.text)).replace(/"/g, '&quot;')}"
        class="experience"
      ></cv-experience>
    `;
  }).join('');
}

function onFilterChange() {
  filteredCvData = filterCvData();
  renderCvContent();
}

function onTagFilterChange() {
  tagFilteredCvData = filterTagCvData();
  updateMaxYears();
  onFilterChange();
}

function getSelectedTags() {
  return Array.from(document.querySelectorAll('#cv-tags-form tag-toggle'))
    .filter(toggle => toggle.checked)
    .map(toggle => toggle.name.trim());
}

function exportToMarkdown() {
  if (!filteredCvData || !filteredCvData.experiences) {
    alert('No experiences to export.');
    return;
  }

  let markdown = '';
  if (cvData && cvData.name) {
    markdown += `# ${cvData.name}\n`;
    markdown += `#### Curriculum Vitae\n\n`;
  } else {
    markdown += `# Curriculum Vitae\n\n`;
  }

  const activeFilters = getSelectedTags();
  if (activeFilters.length > 0) {
    markdown += `**Roles:** ${activeFilters.join(', ')}\n\n`;
  }

  const yearDepth = document.getElementById('experience-filter')?.value || '0';
  markdown += `*Experience timeframe: ${yearDepth} years*\n\n`;

  filteredCvData.experiences.forEach(exp => {
    markdown += `## ${exp.title} at ${exp.company}\n`;
    markdown += `*${exp.location || 'N/A'}* | *${exp.start_date || 'N/A'} - ${exp.end_date || 'Present'}* | *${exp.employment_type || 'Employed'}*\n\n`;
    if (exp.traits && exp.traits.length > 0) {
      markdown += `**Traits:** ${exp.traits.join(', ')}\n\n`;
    }
    if (exp.descriptions && exp.descriptions.length > 0) {
      exp.descriptions.forEach(desc => {
        markdown += `- ${desc.text}\n`;
      });
      markdown += '\n';
    }
  });

  const blob = new Blob([markdown], {type: 'text/markdown'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  let nameForFilename = cvData?.name || 'cv';
  let filename = nameForFilename.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (activeFilters.length > 0) {
    filename += '_' + activeFilters.map(tag => tag.toLowerCase().replace(/\s+/g, '-')).join('-');
  }
  filename += '_cv_' + dateStr + '.md';

  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getTagsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tagsParam = params.get('tags');
  if (!tagsParam) return [];
  return tagsParam.split(',').map(tag => tag.trim()).filter(Boolean);
}

// Initialize once custom elements are registered
Promise.all([
  customElements.whenDefined('tag-toggle'),
  customElements.whenDefined('time-filter')
]).then(() => {
  // Apply URL tag state before binding listeners
  const urlTags = getTagsFromUrl();
  if (urlTags.length > 0) {
    document.querySelectorAll('tag-toggle').forEach(toggle => {
      if (urlTags.includes(toggle.name.trim())) {
        toggle.checked = true;
      }
    });
  }

  // Bind filter listeners
  document.querySelectorAll('tag-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => onTagFilterChange());
  });
  const timeFilter = document.getElementById('experience-filter');
  if (timeFilter) {
    timeFilter.addEventListener('change', () => onFilterChange());
  }

  // Run initial filter (recomputes tagFilteredCvData and time slider max)
  onTagFilterChange();
});
