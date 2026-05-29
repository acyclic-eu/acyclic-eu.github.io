import { passesTagFiltering, sortByDateDesc, passesTimeFilter, applyTagsAndSort } from './cv-filter-utils.js';

let cvData = null;
let filteredCvData = null;
let tagFilteredCvData = null;

// Wait for cv-experience component before loading data
customElements.whenDefined('cv-experience').then(() => {
  fetch('/cv/cv.json')
    .then(response => response.json())
    .then(data => {
      cvData = data;
      tagFilteredCvData = filterTagCvData();
      updateMaxYears();
      onFilterChange();
    })
    .catch(err => console.error('Failed to load cv.json', err));
});

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


function filterTagCvData() {
  if (!cvData) return null;
  return { ...cvData, experiences: applyTagsAndSort(cvData.experiences, getSelectedTags()) };
}

function filterCvData() {
  if (!cvData) return null;
  const selectedTags = getSelectedTags();
  const yearDepth = parseInt(document.getElementById('experience-filter')?.value || '0', 10);
  const today = new Date();
  const timeFiltered = cvData.experiences.filter(exp => passesTimeFilter(exp, yearDepth, today));
  return { ...cvData, experiences: applyTagsAndSort(timeFiltered, selectedTags) };
}

function renderCvContent() {
  const container = document.getElementById('cv-content');
  if (!container) return;
  if (!filteredCvData || !filteredCvData.experiences) {
    const msg = document.createElement('em');
    msg.textContent = 'No experiences to display.';
    container.replaceChildren(msg);
    return;
  }

  const fragment = document.createDocumentFragment();
  filteredCvData.experiences.forEach(exp => {
    const el = document.createElement('cv-experience');
    // Set properties directly instead of attributes for Hybrids
    el.title = exp.title || '';
    el.tagline = exp.tagline || '';
    el.company = exp.company || '';
    el.traits = exp.traits ? exp.traits.join(', ') : '';
    el.location = exp.location || 'N/A';
    el.startDate = exp.start_date || 'N/A';
    el.endDate = exp.end_date || 'Present';
    el.employmentType = exp.employment_type || 'Employed';
    el.expTags = encodeURIComponent(exp.tags ? exp.tags.join(',') : '');
    el.descriptions = exp.descriptions.map(desc => desc.text);
    el.className = 'experience';
    fragment.appendChild(el);
  });
  container.replaceChildren(fragment);
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
    .map(toggle => (toggle.name || toggle.getAttribute('name') || '').trim());
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
  customElements.whenDefined('time-filter'),
  customElements.whenDefined('cv-experience')
]).then(() => {
  // Apply URL tag state before binding listeners
  const urlTags = getTagsFromUrl();
  if (urlTags.length > 0) {
    document.querySelectorAll('#cv-tags-form tag-toggle').forEach(toggle => {
      if (urlTags.includes(toggle.name.trim())) {
        toggle.checked = true;
      }
    });
  }

  // Bind filter listeners
  document.querySelectorAll('#cv-tags-form tag-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => onTagFilterChange());
  });
  const timeFilter = document.getElementById('experience-filter');
  if (timeFilter) {
    timeFilter.addEventListener('change', () => onFilterChange());
  }

  // Bind export button
  document.getElementById('export-markdown')?.addEventListener('click', exportToMarkdown);

  // Run initial filter (recomputes tagFilteredCvData and time slider max)
  onTagFilterChange();
});
