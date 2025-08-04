/**
 * Hybrids Component Auto-Tester
 *
 * This utility automatically discovers and tests Hybrids components
 * by analyzing their properties and generating test cases.
 */

// Store discovered components
let discoveredComponents = [];

/**
 * Discover all Hybrids components in the components directory
 */
async function discoverComponents() {
  try {
    // Get all JS files in the components directory
    const response = await fetch('/public/Components/');
    const html = await response.text();

    // Parse HTML to find component files
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'));

    const jsFiles = links
      .map(link => link.getAttribute('href'))
      .filter(href => href && href.endsWith('.js') &&
              !href.includes('auto-tester') &&
              !href.includes('node_modules'));

    console.log(`Found ${jsFiles.length} JavaScript files`);

    // Process each JS file
    for (const file of jsFiles) {
      const url = new URL(file, window.location.origin + '/public/Components/').href;
      const component = await analyzeComponent(url);

      if (component) {
        discoveredComponents.push(component);
        // Import the component
        try {
          await import(url);
          console.log(`Loaded component: ${component.tag}`);
        } catch (err) {
          console.error(`Error loading component ${component.tag}:`, err);
        }
      }
    }

    return discoveredComponents;
  } catch (error) {
    console.error('Error discovering components:', error);
    return [];
  }
}

/**
 * Analyze a component file to extract its properties, including JSDoc info
 */
async function analyzeComponent(url) {
  try {
    // Fetch the component file
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Skipped: Failed to fetch ${url}`);
      return null;
    }
    const code = await response.text();

    // Extract tag name
    const tagMatch = code.match(/tag\s*:\s*["']([^"']+)["']/m);
    if (!tagMatch) return null;

    const tag = tagMatch[1];
    console.log(`Found component: ${tag}`);

    // Extract file name from URL
    const fileName = url.split('/').pop();

    // Extract properties ONLY from the main define({ ... }) block
    const defineMatch = code.match(/define\s*\(\s*{([\s\S]*?)}\s*\)/m);
    if (!defineMatch) return null;

    const defineBlock = defineMatch[1];

    const properties = {};

    // Find all property blocks with JSDoc inside define({ ... })
    const propBlocks = [...defineBlock.matchAll(/(\/\*\*([\s\S]*?)\*\/)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([^,]+),?/g)];
    for (const block of propBlocks) {
      const jsdoc = block[2] || '';
      const propName = block[3].trim();
      const propValue = block[4].trim();
      if (propName === 'tag' || propName === 'render' || propValue.includes('function') || propValue.includes('=>')) continue;

      let type = 'string';
      let defaultValue = '';
      let fromJSDoc = false;
      let jsdocExample = undefined;
      let jsdocType = undefined;

      // Parse JSDoc for @type and @example
      if (jsdoc) {
        const typeMatch = jsdoc.match(/@type\s+{([^}]+)}/);
        if (typeMatch) {
          jsdocType = typeMatch[1].trim();
          type = jsdocType;
          fromJSDoc = true;
        }
        const exampleMatch = jsdoc.match(/@example\s+([\s\S]*?)(?=@|\*\/)/);
        if (exampleMatch) {
          jsdocExample = exampleMatch[1].trim();
          defaultValue = jsdocExample;
          fromJSDoc = true;
        }
      }

      // If no JSDoc type/example, infer type/default as before
      if (!fromJSDoc) {
        if (propValue === 'false' || propValue === 'true') {
          type = 'boolean';
          defaultValue = propValue === 'true';
        } else if (!isNaN(Number(propValue))) {
          type = 'number';
          defaultValue = Number(propValue);
        } else if (propValue.startsWith('{') || propValue.startsWith('[')) {
          type = propValue.startsWith('{') ? 'object' : 'array';
          defaultValue = propValue;
        } else {
          const stringMatch = propValue.match(/["'](.*)["']/m);
          if (stringMatch) {
            defaultValue = stringMatch[1];
          }
        }
      }

      properties[propName] = { type, defaultValue, fromJSDoc, syntax: propValue, jsdocType, jsdocExample };
    }

    return { tag, fileName, properties, url };
  } catch (error) {
    console.error(`Error analyzing component ${url}:`, error);
    return null;
  }
}

/**
 * Generate a test instance for a component
 */
function generateTestInstance(component, customProps = {}) {
  const element = document.createElement(component.tag);

  // Set properties only if value is not undefined or empty string
  Object.entries(component.properties).forEach(([name, details]) => {
    if (name in customProps) {
      if (customProps[name] !== undefined && customProps[name] !== '') {
        element[name] = customProps[name];
      }
    } else if (details.defaultValue !== undefined && details.defaultValue !== '') {
      element[name] = details.defaultValue;
    }
  });

  return element;
}

/**
 * Generate sample values for component properties
 */
function generateSampleValues(propType, currentValue) {
  switch (propType) {
    case 'boolean':
      return [true, false];
    case 'number':
      return [0, 10, -5, 100];
    case 'string':
      return ['', 'Sample Text', 'Another Example', '<strong>HTML Test</strong>'];
    case 'object':
      return [{}];
    case 'array':
      return [[], [1, 2, 3]];
    default:
      return [currentValue];
  }
}

/**
 * Render a component test panel
 */
function renderComponentTestPanel(component) {
  // Create panel
  const panel = document.createElement('div');
  panel.className = 'component-test-panel';

  // Create header
  const header = document.createElement('h2');
  header.textContent = `${component.fileName} - <${component.tag}>`;
  panel.appendChild(header);

  // Store current prop values
  const currentProps = {};

  // --- PROPS PANEL ---
  const propsPanel = document.createElement('div');
  propsPanel.className = 'props-panel';

  // --- EXAMPLE PANEL ---
  const examplePanel = document.createElement('div');
  examplePanel.className = 'example-panel';

  // --- CODE PREVIEW ---
  const codePreview = document.createElement('pre');
  codePreview.className = 'component-html-preview';
  codePreview.style.marginTop = '1em';
  codePreview.style.background = '#f4f4f4';
  codePreview.style.padding = '0.5em';
  codePreview.style.borderRadius = '0.25em';

  // Helper to update the HTML code preview
  function updateCodePreview() {
    const attrs = Object.entries(currentProps)
      .map(([k, v]) => {
        if (typeof v === 'boolean') {
          return v ? k : '';
        }
        if (typeof v === 'object') {
          return `${k}='${JSON.stringify(v)}'`;
        }
        return `${k}="${String(v)}"`;
      })
      .filter(Boolean)
      .join(' ');
    codePreview.textContent = `<${component.tag}${attrs ? ' ' + attrs : ''}></${component.tag}>`;
  }

  // --- PROP CONTROLS ---
  Object.entries(component.properties).forEach(([propName, propDetails]) => {
    if (propName === 'tag' || propName === 'render') return;
    const select = document.createElement('select');
    select.className = 'prop-dropdown';
    let options = generateSampleValues(propDetails.type, propDetails.defaultValue);
    if (!options.includes(propDetails.defaultValue)) {
      options = [propDetails.defaultValue, ...options];
    }
    options = Array.from(new Set(options));
    // Add an empty option at the top
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '(unset)';
    select.appendChild(emptyOption);
    options.forEach(value => {
      if (value === undefined || value === '') return;
      const option = document.createElement('option');
      option.value = typeof value === 'object' ? JSON.stringify(value) : value;
      option.textContent = propDetails.type === 'object' || propDetails.type === 'array'
        ? JSON.stringify(value)
        : String(value);
      select.appendChild(option);
    });
    // Set initial value
    select.value = propDetails.defaultValue !== undefined && propDetails.defaultValue !== '' ? select.options[1]?.value : '';
    if (select.value) {
      currentProps[propName] = parseDropdownValue(select.value, propDetails.type);
    }
    // Label
    const label = document.createElement('label');
    label.textContent = propName + ': ';
    label.appendChild(select);
    label.style.marginRight = '1em';
    propsPanel.appendChild(label);
    // Update prop on change
    select.addEventListener('change', () => {
      if (select.value === '') {
        delete currentProps[propName];
      } else {
        currentProps[propName] = parseDropdownValue(select.value, propDetails.type);
      }
      // Replace the instance with a new one with updated props
      const newInstance = generateTestInstance(component, currentProps);
      examplePanel.replaceChild(newInstance, examplePanel.firstChild);
      updateCodePreview();
    });
  });

  // --- EXAMPLE INSTANCE ---
  let basicInstanceEl = generateTestInstance(component, currentProps);
  examplePanel.appendChild(basicInstanceEl);

  // Initial code preview
  updateCodePreview();

  // --- CONTROL ORDER HERE ---
  panel.appendChild(propsPanel);      // Props controls first
  panel.appendChild(codePreview);    // HTML code preview second
  panel.appendChild(examplePanel);   // Example instance third

  // Instead of appending to container, just return the panel
  return panel;
}

/**
 * Initialize the component tester
 * @param {string} containerId - ID of the container element
 * @param {Array<string>} componentFiles - Optional list of component file paths
 */
async function initComponentTester(containerId, componentFiles = []) {
  // Find the grid container and the tester container
  const container = document.getElementById(containerId);
  const grid = container.closest('.component-grid');
  if (!container || !grid) {
    console.error(`Container element #${containerId} or .component-grid not found`);
    return;
  }

  // Clear only the grid, not the theme toggle or header
  grid.innerHTML = '';
  // Add a placeholder/loading
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Analyzing components...';
  grid.appendChild(loading);

  let components = [];

  if (componentFiles && componentFiles.length > 0) {
    for (const file of componentFiles) {
      let url = file;
      if (!/^([a-z]+:)?\/\//i.test(file)) {
        url = new URL(file, window.location.origin + '/public/Components/').href;
      }
      const component = await analyzeComponent(url);

      if (component) {
        components.push(component);
        try {
          await import(url);
        } catch (err) {
          console.error(`Error loading component ${component.tag}:`, err);
        }
      }
    }
  } else {
    components = await discoverComponents();
  }

  // Remove loading indicator
  loading.remove();

  // Render all component panels inside the grid
  components.forEach(component => grid.appendChild(renderComponentTestPanel(component)));
}

// --- Theme Switcher ---
// Theme is now controlled by CSS variables in dynamic-tester.html
// via the data-theme attribute on the theme-scope element

function renderThemeSwitcher(container) {
  // Remove any previous switcher
  const prev = container.querySelector('.theme-switcher');
  if (prev) prev.remove();

  const switcher = document.createElement('div');
  switcher.className = 'theme-switcher';
  switcher.style.display = 'flex';
  switcher.style.alignItems = 'center';
  switcher.style.gap = '1em';
  switcher.style.marginBottom = '1.5em';
  switcher.style.padding = '0.5em 0';

  const label = document.createElement('span');
  label.textContent = 'Theme:';

  const lightBtn = document.createElement('button');
  lightBtn.textContent = 'Light';
  lightBtn.type = 'button';
  lightBtn.style.cursor = 'pointer';

  const darkBtn = document.createElement('button');
  darkBtn.textContent = 'Dark';
  darkBtn.type = 'button';
  darkBtn.style.cursor = 'pointer';

  function setActive(theme) {
    if (theme === 'light') {
      lightBtn.disabled = true;
      darkBtn.disabled = false;
      lightBtn.style.fontWeight = 'bold';
      darkBtn.style.fontWeight = '';
    } else {
      darkBtn.disabled = true;
      lightBtn.disabled = false;
      darkBtn.style.fontWeight = 'bold';
      lightBtn.style.fontWeight = '';
    }
  }

  // Get the theme scope element from the document
  const themeScope = document.getElementById('theme-scope');

  // Function to set theme using the data-theme attribute
  function setThemeAttribute(theme) {
    if (themeScope) {
      if (theme === 'dark') {
        themeScope.setAttribute('data-theme', 'dark');
      } else {
        themeScope.setAttribute('data-theme', 'light');
      }
    }
    setActive(theme);
  }

  lightBtn.onclick = () => {
    setThemeAttribute('light');
  };

  darkBtn.onclick = () => {
    setThemeAttribute('dark');
  };

  // Default to light theme
  setThemeAttribute('light');

  switcher.appendChild(label);
  switcher.appendChild(lightBtn);
  switcher.appendChild(darkBtn);

  // Insert at the top of the container
  container.prepend(switcher);
}

// --- Style Injection ---
const style = document.createElement('style');
style.textContent = `
  .component-test-panel {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid var(--theme-panel-border, #ddd);
    border-radius: 0.5rem;
    background-color: var(--theme-panel-bg, #f9f9f9);
    color: var(--theme-panel-text, #222);
    display: flex;
    flex-direction: column;
  }

  .component-test-panel h2 {
    color: var(--theme-tag-toggle-selected-bg, #4285f4);
    margin-top: 0;
  }

  .basic-test, .prop-tests {
    margin: 1rem 0;
  }

  .prop-tester {
    margin-bottom: 1.5rem;
  }

  .value-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .value-test {
    padding: 0.5rem;
    background-color: white;
    border: 1px solid #eee;
    border-radius: 0.25rem;
  }

  .value-label {
    font-family: monospace;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    padding: 0.25rem;
    background-color: #f0f0f0;
    border-radius: 0.25rem;
    word-break: break-all;
  }

  .component-html-preview {
    background: var(--theme-html-preview-bg, #f4f4f4);
    color: inherit;
  }

  /* Make unchecked tag-toggles look clickable */
  .tag-toggle:not(:checked) + label,
  .tag-toggle:not(:checked) {
    cursor: pointer;
    opacity: 0.85;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .tag-toggle:not(:checked) + label:hover,
  .tag-toggle:not(:checked):hover {
    background: var(--theme-tag-toggle-selected-bg, #e0e7ff);
    box-shadow: 0 0 0 2px #a5b4fc;
  }
`;
document.head.appendChild(style);

// --- Utility ---
function parseDropdownValue(value, type) {
  if (type === 'boolean') return value === 'true' || value === true;
  if (type === 'number') return Number(value);
  if (type === 'object' || type === 'array') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

// --- Exports ---
export {
  discoverComponents,
  generateTestInstance,
  renderComponentTestPanel,
  initComponentTester
};
