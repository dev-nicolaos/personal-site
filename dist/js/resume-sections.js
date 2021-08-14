const renderListItem = (content) =>
  `<li class="resume-section_list-item">${content}</li>`;

const renderSublist = ([title, items]) => `
  <li class="resume-section_sublist">
    <h4 class="resume-section_subtitle">${title}</h4>
    <ul class="resume-section_list">
      ${items.map(renderListItem).join('')}
    </ul>
  </li>
`;

const renderSection = ([title, items]) => `
  <section class="resume-section">
    <h3 class="resume-section_title">${title}</h3>
    <ul class="resume-section_list">
      ${Array.isArray(items)
        ? items.map(renderListItem).join('')
        : Object.entries(items).map(renderSublist).join('')
      }
    </ul>
  </section>
`;

// TODO: remove IIFE when top level await has wide support
// https://caniuse.com/mdn-javascript_operators_await_top_level
(async () => {
  const response = await fetch("/assets/resume.json");
  const container = document.getElementsByTagName("main")[0];
  container.innerHTML = Object.entries(await response.json())
    .map(renderSection)
    .join('');
})();
