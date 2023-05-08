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
    <div class="filters">
      <div class="filter-head">Filters</div>
      ${filters.map((filter, i) => `
        <div>
          <div class="filter-name">
            ${filter.name}
          </div>
          <div class="filter-dropdown">
            <button aria-controls="filter-${i}">${filter.values.length} ${filter.name}</button>
            <div aria-hidden="true" id="filter-${i}" class="filter-dropdown-values">
              ${filter.values.map((value) => `
                ${value}
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
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
}
