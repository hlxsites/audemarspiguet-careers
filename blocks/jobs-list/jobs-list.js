import { decorateIcons } from '../../scripts/lib-franklin.js';

function getFiltersFromUrl() {
  const filters = {};

  const searchKeys = new URL(window.location.href).searchParams.entries();
  [...searchKeys].forEach(([key, values]) => {
    filters[key] = JSON.parse(values);
  });
  return filters;
}

function setFilterInUrl(filterName, filterValue, isActive) {
  const currentUrl = new URL(window.location);
  const currentValuesForFilter = currentUrl.searchParams.get(filterName) || '[]';
  const valuesForFilter = isActive
    ? [...JSON.parse(currentValuesForFilter), filterValue]
    : JSON.parse(currentValuesForFilter).filter((v) => v !== filterValue);
  if (valuesForFilter.length > 0) {
    currentUrl.searchParams.set(filterName, JSON.stringify(valuesForFilter));
  } else {
    currentUrl.searchParams.delete(filterName);
  }
  window.history.pushState({}, '', currentUrl);
}

function filterData(data, activeFilters) {
  let filteredData = data;

  Object.keys(activeFilters).forEach((filterName) => {
    filteredData = filteredData.filter(
      (jobListing) => activeFilters[filterName].includes(jobListing[filterName]),
    );
  });

  return filteredData;
}

function renderTable(parent, data) {
  parent.innerHTML = `
    <thead>
        <tr>
          <th>Openings</th>
          <th>Location</th>
          <th>Date Posted</th>
        </tr>
      </thead>
      <tbody>
        ${data.map((job) => `
          <tr>
            <td>${job.title}</td>
            <td>${job.location}</td>
            <td>${job.date.toLocaleDateString('en-UK', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
          </tr>
        `).join('')}
      </tbody>
  `;
}

function renderLayout(block, data, filters) {
  block.innerHTML = `
    <button aria-controls="filters-tab" name="filters toggle">
      <span class="icon icon-filters"></span>Filters <span class="num-selected">(0 selected)</span>
    </button>
    <div aria-hidden="true" class="filters" id="filters-tab">
      
      <div class="filter-head">
        <span class="icon icon-filters"></span>
        <span>Filters</span>
        <button name="filters close">
          <span class="icon icon-close"></span>
        </button>
      </div>
      <div class="filter-body">
        ${filters.map((filter, i) => `
          <div>
            <label class="filter-name" for="dropdown-${filter.name}">
              ${filter.name}
            </label>
            <div class="filter-dropdown" id="dropdown-${filter.name}">
              <button aria-controls="filter-${i}">
                ${filter.values.length} ${filter.name} 
                <span class="icon icon-chevron-down"></span>
              </button>
              <div aria-hidden="true" id="filter-${i}" class="filter-dropdown-values">
                ${filter.values.map((value) => `
                  <div>
                    <input 
                      id="check-${filter.name}-${value}" 
                      data-filter-name="${filter.field}" 
                      data-filter-value="${value}" 
                      type="checkbox" />
                    <label for="check-${filter.name}-${value}" ${value}>${value}</label>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <table>
      
    </table>
  `;

  renderTable(block.querySelector('table'), data);
}

export default function decorate(block) {
  block.textContent = '';

  // TODO fetch data
  const dummyJobs = [
    {
      title: 'Controleur de Gestion - IT',
      location: 'Le Brassus, CH',
      date: new Date(Date.now()),
    },
    {
      title: 'Boutique Sales Associate',
      location: 'Geneve, CH',
      date: new Date(Date.now()),
    },
  ];

  const filters = [
    {
      name: 'locations',
      field: 'location',
      values: [
        'Geneve, CH',
        'Le Brassus, CH',
      ],
    },
    {
      name: 'departments',
      field: 'department',
      values: [
        'Finance',
        'IT',
        'Sales',
      ],
    },
    {
      name: 'employee type',
      field: 'employee-type',
      values: [
        'Unlimited Duration',
        'Trainee',
        'Fixed Term',
        'Interim',
        'Apprentice',
      ],
    },
    {
      name: 'job families',
      field: 'job-family',
      values: [
        'Unlimited Duration',
        'Trainee',
        'Fixed Term',
        'Interim',
        'Apprentice',
      ],
    },
  ];

  const activeFilters = getFiltersFromUrl();

  renderLayout(block, filterData(dummyJobs, activeFilters), filters);

  /* Close the filters tab on mobile */
  block.querySelector('button[name="filters close"]').addEventListener('click', () => {
    block.querySelector('#filters-tab').setAttribute('aria-hidden', true);
  });

  /* Open/toggle the filters tab on mobile */
  block.querySelector('button[name="filters toggle"]').addEventListener('click', () => {
    const filtersTab = block.querySelector('#filters-tab');
    if (filtersTab.getAttribute('aria-hidden') === 'true') {
      filtersTab.setAttribute('aria-hidden', false);
    } else {
      filtersTab.setAttribute('aria-hidden', true);
    }
  });

  /* Toggle a single filter category dropdown */
  [...block.querySelectorAll('.filter-dropdown > button')].forEach((button) => {
    button.addEventListener('click', () => {
      const dropdownTab = block.querySelector(`#${button.getAttribute('aria-controls')}`);
      if (dropdownTab.getAttribute('aria-hidden') === 'true') {
        dropdownTab.setAttribute('aria-hidden', false);
        dropdownTab.closest('.filter-dropdown').setAttribute('data-expanded', '');
      } else {
        dropdownTab.setAttribute('aria-hidden', true);
        dropdownTab.closest('.filter-dropdown').removeAttribute('data-expanded');
      }
    });
  });

  /* Set query parameters from checkboxes */
  [...block.querySelectorAll('input')].forEach((input) => {
    input.addEventListener('change', (e) => {
      const isChecked = e.currentTarget.checked;
      const filterName = input.getAttribute('data-filter-name');
      const filterValue = input.getAttribute('data-filter-value');
      setFilterInUrl(filterName, filterValue, isChecked);

      /* re-render table on filter change */
      renderTable(document.querySelector('table'), filterData(dummyJobs, getFiltersFromUrl()));
    });
  });

  /* Set checkboxes from query parameters */
  Object.keys(activeFilters).forEach((key) => {
    const filterValues = activeFilters[key];
    filterValues.forEach((value) => {
      const checkbox = document.querySelector(`input[data-filter-name='${key}'][data-filter-value='${value}']`);
      checkbox.checked = true;
    });
  });

  decorateIcons(block);
}
