export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('inner-container');

  const h1 = block.querySelector('h1');
  const p = block.querySelectorAll('p');

  container.append(h1, ...p);

  block.appendChild(container);
}
