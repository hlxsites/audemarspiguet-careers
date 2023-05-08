import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorate video links
 */
function decorateVideoLinks(element) {
  element.querySelectorAll('a[href^="https://www.brightcove.com/"]').forEach((a) => {
    const id = a.href.substring(27);
    const player = document.createElement('video');
    player.className = 'video-js';
    player.setAttribute('data-video-id', id);
    player.setAttribute('data-account', '1275282095001');
    player.setAttribute('data-player', '9rGCgus7j');
    player.setAttribute('poster', '');
    const parent = a.parentElement;
    const pictureSibling = parent.previousElementSibling?.firstElementChild;
    const grandparent = parent.parentElement;
    grandparent.removeChild(parent);
    grandparent.className = 'video-container';
    if (pictureSibling) {
      const oldParent = pictureSibling.parentElement;
      pictureSibling.className = 'video-image';
      grandparent.appendChild(pictureSibling);
      oldParent.parentElement.removeChild(oldParent);
    }
    grandparent.appendChild(player);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateVideoLinks(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

export async function showLanguageSelector() {
  let selector = document.getElementById('language-selector');
  if (!selector) {
    selector = document.createElement('div');
    selector.id = 'language-selector';
    const resp = await fetch('/languages.json');
    if (resp.ok) {
      const head = document.querySelector('head');
      const script = document.createElement('script');
      script.innerHTML = `
        function markLanguage(title, submit) {
          document.getElementById('language-title').innerText = title.toUpperCase();
          document.getElementById('language-submit').innerText = submit.toUpperCase();
        }
        function selectLanguage() {
          const selected = document.querySelector('input[name="language"]:checked');
          const paths = window.location.pathname.split('/');
          paths[1] = selected.value.substring(1);
          window.location.pathname = paths.join('/');
          return false;
        }
      `;
      head.append(script);

      const obj = await resp.json();
      const currentPrefix = `/${window.location.pathname.split('/')[1]}`;
      let title = 'Choose your language';
      let submit = 'Submit';
      const buttons = obj.data.map((lang) => {
        const selected = lang.Prefix === currentPrefix;
        const id = `lang_${lang.Prefix.substring(1)}`;
        if (selected) {
          title = lang.Title;
          submit = lang.Submit;
        }
        return `<li>
          <input type="radio" name="language" onclick="markLanguage('${lang.Title}', '${lang.Submit}')"
            value="${lang.Prefix}" id="${id}" ${selected ? 'checked' : ''}/>
          <label for="${id}">${lang.Language.toUpperCase()}</label>
            </li>`;
      }).join('');
      selector.innerHTML = `
        <h2 id="language-title">${title.toUpperCase()}</h2>
        <script>
          function selectLanguage(title, submit) {
            document.getElementById('language-title').innerText = title;
            document.getElementById('language-submit').innerText = submit;
          }
        </script>
        <form action="" onsubmit="return selectLanguage()">
        <ul>
        ${buttons}
        </ul>
        <button id="language-submit" type="submit">${submit.toUpperCase()}</button>
        </form>
      `;
      document.body.appendChild(selector);
    }
  }
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
