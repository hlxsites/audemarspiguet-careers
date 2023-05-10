export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('inner-container');

  const h1 = block.querySelector('h1');
  const text = block.querySelectorAll('p:not([class*="button-container"])');
  const link = block.querySelector('p[class*="button-container"]');
  link.classList.remove('button-container');
  link.querySelector('a').classList.remove('button');

  // If block config includes "with-form", add search form
  const searchForm = document.createElement('form');

  if (block.classList.contains('with-search-form')) {
    const input = document.createElement('input');
    input.setAttribute('type', 'search');
    input.setAttribute('name', 'query');
    input.setAttribute('placeholder', 'Search by role or keyword');
    input.setAttribute('aria-label', 'Search by role or keyword');
    searchForm.append(input);

    searchForm.setAttribute('display', 'visible');
  }

  container.append(h1, ...text, searchForm, link);

  block.appendChild(container);
}
