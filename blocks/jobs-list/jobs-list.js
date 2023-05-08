import { decorateIcons } from '../../scripts/lib-franklin.js';

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
      field: 'employee-type',
      values: [
        'Unlimited Duration',
        'Trainee',
        'Fixed Term',
        'Interim',
        'Apprentice',
      ],
    },
  ];

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
                    <input id="check-${filter.name}-${value}" type="checkbox" />
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
      <thead>
        <tr>
          <th>Openings</th>
          <th>Location</th>
          <th>Date Posted</th>
        </tr>
      </thead>
      <tbody>
        ${dummyJobs.map((job) => `
          <tr>
            <td>${job.title}</td>
            <td>${job.location}</td>
            <td>${job.date.toLocaleDateString('en-UK', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  block.querySelector('button[name="filters close"]').addEventListener('click', () => {
    block.querySelector('#filters-tab').setAttribute('aria-hidden', true);
  });

  block.querySelector('button[name="filters toggle"]').addEventListener('click', () => {
    const filtersTab = block.querySelector('#filters-tab');
    if (filtersTab.getAttribute('aria-hidden') === 'true') {
      filtersTab.setAttribute('aria-hidden', false);
    } else {
      filtersTab.setAttribute('aria-hidden', true);
    }
  });

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

  decorateIcons(block);
}
