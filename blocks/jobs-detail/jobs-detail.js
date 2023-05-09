import { decorateIcons, readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const htmlDescriptionResponse = await fetch('/blocks/jobs-detail/career-details.fragment.html');
  const htmlDescription = await htmlDescriptionResponse.text();

  const mockJob = {
    title: 'Contrôleur de Gestion - IT',
    location: 'Le Brassus, CH',
    department: 'Finance',
    employeeType: 'Unlimited Duration',
    posted: 'May 8, 2023',
    description: htmlDescription,
  };

  document.querySelector('h1').textContent = mockJob.title;

  block.innerHTML = `
    <div class="sidebar">
      <div class="details">
        <div>Location : <span>${mockJob.location}</span></div>
        <div>Department : <span>${mockJob.department}</span></div>
        <div>Employee Type : <span>${mockJob.employeeType}</span></div>
        <div>Posted : <span>${mockJob.posted}</span></div>
      </div>
      <a href="${window.location.pathname}/form" class="button apply capital-wide-letters">Apply Now</a>
      <div class="job-links">
        <button onclick="window.print()" name="print"><span class="icon icon-print"></span></button>
        <button name="share"><span class="icon icon-share"></span></button>
        <div class="share-links" aria-hidden="true">
          <a href="https://facebook.com/sharer/sharer.php?u=https://careers.audemarspiguet.com/en/offer/995132">
            <span class="icon icon-facebook">
          </a>
          <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://careers.audemarspiguet.com/en/offer/995132%2F&title=Contrôleur de Gestion - IT&summary=Contrôleur de Gestion - IT&source=https://careers.audemarspiguet.com/en/offer/995132">
            <span class="icon icon-linkedin">
          </a>
          <a href="https://twitter.com/intent/tweet/?text=Contrôleur de Gestion - IT%20-&url=https://careers.audemarspiguet.com/en/offer/995132">
            <span class="icon icon-twitter">
          </a>
          <a href="mailto:?subject=Contrôleur de Gestion - IT&body=https://careers.audemarspiguet.com/en/offer/995132">
            <span class="icon icon-email">
          </a>
        </div>
      </div>
    </div>
    <div class="main">
      ${mockJob.description}
      <a href="${window.location.pathname}/form" class="button apply capital-wide-letters">Apply Now</a>
    </div>
  `;

  block.querySelector('button[name="share"]').addEventListener('click', () => {
    const elToToggle = block.querySelector('.share-links');
    if (elToToggle.getAttribute('aria-hidden') === 'true') {
      elToToggle.setAttribute('aria-hidden', false);
    } else {
      elToToggle.setAttribute('aria-hidden', true);
    }
  });

  decorateIcons(block);
}
