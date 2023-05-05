// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
loadScript('/scripts/video.js', () => {
  document.querySelectorAll('video').forEach((v) => {
    // eslint-disable-next-line no-undef
    bc(v);
  });
});
