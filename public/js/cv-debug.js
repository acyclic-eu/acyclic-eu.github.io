// CV Filter Diagnostics Tool

function debugCVFilters() {
  console.log('CV Filter Diagnostic Tool');
  console.log('============================');

  // Get all experiences and add debug info
  const experiences = document.querySelectorAll('#cv-content .experience');
  console.log(`Total experiences: ${experiences.length}`);

  experiences.forEach((exp, index) => {
    // Get experience data
    const title = exp.querySelector('h2').textContent;
    const expTags = exp.getAttribute('data-exp-tags');
    const isTagged = expTags !== 'always';
    const display = exp.style.display;

    console.log(`\nExp #${index + 1}: ${title}`);
    console.log(`Tags: ${expTags}`);
    console.log(`Has explicit tags: ${isTagged}`);
    console.log(`Currently displayed: ${display === '' ? 'Yes' : 'No'}`);
  });

  // Get checked filter tags
  const checkedTags = Array.from(document.querySelectorAll('#cv-tags-form input[type=checkbox]:checked'))
    .map(cb => decodeURIComponent(cb.value).trim());

  console.log('\nFilter state:');
  console.log(`Checked tags: ${checkedTags.length ? checkedTags.join(', ') : 'None'}`);
  console.log(`Year depth: ${document.getElementById('experience-age').value}`);
}

// Add debug button
function addDebugButton() {
  const form = document.getElementById('cv-tags-form');
  if (!form) return;

  const debugButton = document.createElement('button');
  debugButton.type = 'button';
  debugButton.textContent = 'Debug Filters';
  debugButton.style.marginLeft = '1em';
  debugButton.style.padding = '2px 8px';
  debugButton.style.fontSize = '0.8em';
  debugButton.style.backgroundColor = '#f5f5f5';
  debugButton.style.border = '1px solid #ddd';
  debugButton.style.borderRadius = '3px';
  debugButton.style.cursor = 'pointer';

  debugButton.addEventListener('click', function(e) {
    e.preventDefault();
    debugCVFilters();
  });

  form.appendChild(debugButton);
}

// Wrap original filterCV function to add diagnostics
let originalFilterCV;
function enhanceFilterCV() {
  if (typeof window.filterCV === 'function' && !originalFilterCV) {
    originalFilterCV = window.filterCV;

    window.filterCV = function() {
      // Call original function
      originalFilterCV.apply(this, arguments);

      // Get filter state
      const checked = Array.from(document.querySelectorAll('#cv-tags-form input[type=checkbox]:checked'))
        .map(cb => decodeURIComponent(cb.value).trim());

      // Log when Business is selected
      if (checked.includes('Business')) {
        console.log('\n🔍 Business tag selected - checking filter results:');

        // Check specifically for experiences without tags
        const noTagExps = Array.from(document.querySelectorAll('#cv-content .experience[data-exp-tags="always"]'));
        console.log(`Found ${noTagExps.length} experiences without tags:`);

        noTagExps.forEach((exp, i) => {
          const title = exp.querySelector('h2').textContent;
          const display = exp.style.display;
          console.log(`${i+1}. "${title}" - visible: ${display === '' ? 'Yes' : 'No'}`);

          if (display !== '') {
            // This experience should be visible - diagnose why it's not
            console.log(`   ⚠️ This untagged experience should be visible!`);

            // Check date filter
            const endDateStr = exp.getAttribute('data-end-date');
            const yearDepth = parseInt(document.getElementById('experience-age').value);
            console.log(`   End date: ${endDateStr}, Year depth: ${yearDepth}`);

            // Recalculate the date filter
            const today = new Date();
            const cutoffYear = today.getFullYear() - yearDepth;
            const cutoffDate = new Date(cutoffYear, today.getMonth(), today.getDate());

            let endDate;
            if (endDateStr === "Present") {
              endDate = new Date();
            } else {
              endDate = new Date(endDateStr);
            }

            const passesDateFilter = yearDepth === 0 ?
                                  (endDateStr === "Present") :
                                  (endDateStr === "Present" || endDate >= cutoffDate);

            console.log(`   Passes date filter: ${passesDateFilter}`);
          }
        });
      }
    };
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    addDebugButton();
    enhanceFilterCV();
    console.log('CV Debug tools initialized. Click "Debug Filters" button to analyze.');
  }, 500);
});
