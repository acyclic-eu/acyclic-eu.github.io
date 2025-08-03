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
    const response = await fetch('/public/Componenets/');
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
      const url = new URL(file, window.location.origin + '/public/Componenets/').href;
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
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const code = await response.text();

    // Extract tag name
    const tagMatch = code.match(/tag\s*:\s*["']([^"']+)["']/m);
    if (!tagMatch) return null;

    const tag = tagMatch[1];
    console.log(`Found component: ${tag}`);

    // Extract file name from URL
    const fileName = url.split('/').pop();

    // Extract properties
    const properties = {};

    // Find all property blocks with JSDoc
    const propBlocks = [...code.matchAll(/(\/\*\*([\s\S]*?)\*\/)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([^,]+),?/g)];
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

  // Set properties
  Object.entries(component.properties).forEach(([name, details]) => {
    if (name in customProps) {
      element[name] = customProps[name];
    } else if (details.defaultValue !== undefined) {
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
function renderComponentTestPanel(component, container) {
  // Create panel
  const panel = document.createElement('div');
  panel.className = 'component-test-panel';

  // Create header
  const header = document.createElement('h2');
  header.textContent = `${component.fileName} - <${component.tag}>`;
  panel.appendChild(header);

  // Create basic instance
  const basicTest = document.createElement('div');
  basicTest.className = 'basic-test';
  basicTest.innerHTML = '<h3>Basic Test</h3>';

  // Create a container for property dropdowns
  const propControls = document.createElement('div');
  propControls.className = 'prop-controls';

  // Store current prop values
  const currentProps = {};
  Object.entries(component.properties).forEach(([propName, propDetails]) => {
    if (propName === 'tag' || propName === 'render') return;
    // Dropdown for property values
    const select = document.createElement('select');
    select.className = 'prop-dropdown';
    let options = generateSampleValues(propDetails.type, propDetails.defaultValue);
    if (!options.includes(propDetails.defaultValue)) {
      options = [propDetails.defaultValue, ...options];
    }
    options = Array.from(new Set(options));
    options.forEach(value => {
      const option = document.createElement('option');
      option.value = typeof value === 'object' ? JSON.stringify(value) : value;
      option.textContent = propDetails.type === 'object' || propDetails.type === 'array'
        ? JSON.stringify(value)
        : String(value);
      select.appendChild(option);
    });
    // Set initial value
    currentProps[propName] = parseDropdownValue(select.value, propDetails.type);
    // Label
    const label = document.createElement('label');
    label.textContent = propName + ': ';
    label.appendChild(select);
    label.style.marginRight = '1em';
    propControls.appendChild(label);
    // Update prop on change
    select.addEventListener('change', () => {
      currentProps[propName] = parseDropdownValue(select.value, propDetails.type);
      // Replace the instance with a new one with updated props
      const newInstance = generateTestInstance(component, currentProps);
      basicTest.replaceChild(newInstance, basicInstanceEl);
      basicInstanceEl = newInstance;
    });
  });
  basicTest.appendChild(propControls);

  // Create the instance and allow updating
  let basicInstanceEl = generateTestInstance(component, currentProps);
  basicTest.appendChild(basicInstanceEl);
  panel.appendChild(basicTest);

  container.appendChild(panel);
}

/**
 * Initialize the component tester
 * @param {string} containerId - ID of the container element
 * @param {Array<string>} componentFiles - Optional list of component file paths
 */
async function initComponentTester(containerId, componentFiles = []) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element #${containerId} not found`);
    return;
  }

  container.innerHTML = '<p>Analyzing components...</p>';

  let components = [];

  if (componentFiles && componentFiles.length > 0) {
    // Use the provided component files
    for (const file of componentFiles) {
      const url = new URL(file, window.location.href).href;
      const component = await analyzeComponent(url);

      if (component) {
        components.push(component);
        // Import the component
        try {
          await import(url);
          console.log(`Loaded component: ${component.tag}`);
        } catch (err) {
          console.error(`Error loading component ${component.tag}:`, err);
        }
      }
    }
  } else {
    // Try to auto-discover components
    components = await discoverComponents();
  }

  if (components.length === 0) {
    container.innerHTML = '<p>No components found</p>';
    return;
  }

  // Do not randomize the order of components
  // const randomizedComponents = [...components].sort(() => Math.random() - 0.5);
  const orderedComponents = components;

  container.innerHTML = '';

  // Add CSS
  const style = document.createElement('style');
  style.textContent = `
    .component-test-panel {
      margin-bottom: 2rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background-color: #f9f9f9;
      /* Ensure consistent display regardless of position */
      display: flex;
      flex-direction: column;
    }

    .component-test-panel h2 {
      color: #4285f4;
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
  `;
  document.head.appendChild(style);

  // Render each component (in order)
  orderedComponents.forEach(component => {
    renderComponentTestPanel(component, container);
  });
}

// Helper to parse dropdown value to correct type
function parseDropdownValue(value, type) {
  if (type === 'boolean') return value === 'true';
  if (type === 'number') return Number(value);
  if (type === 'object' || type === 'array') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
}

export {
  discoverComponents,
  generateTestInstance,
  renderComponentTestPanel,
  initComponentTester
};
