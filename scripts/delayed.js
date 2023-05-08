// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
const nodes = document.querySelectorAll('video');
if (nodes.length > 0) {
  loadScript('https://players.brightcove.net/1275282095001/9rGCgus7j_default/index.min.js', () => {
    nodes.forEach((v) => {
      const parent = v.parentElement;
      // eslint-disable-next-line no-undef
      const player = bc(v);
      player.controls(true);
      player.on('play', () => {
        parent.children[0].style.visibility = 'hidden';
        parent.children[1].style.display = 'block';
        parent.children[1].children[0].style.display = 'block';
      });
    });
  });
}
