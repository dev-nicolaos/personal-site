import sections from "./data/resume-sections.json" assert { type: "json" };

const renderListItem = (content) =>
  /*html*/`<li class="list-item">${content}</li>`;

const renderSublist = ([title, items]) => /*html*/`
  <li class="resume-section_sublist">
    <h3 class="resume-section_subtitle">${title}</h3>
    <ul>
      ${items.map(renderListItem).join('')}
    </ul>
  </li>
`;

const renderSection = ([title, items]) => /*html*/`
  <section class="resume-section">
    <h2 class="resume-section_title">${title}</h2>
    <ul>
      ${Array.isArray(items)
        ? items.map(renderListItem).join('')
        : Object.entries(items).map(renderSublist).join('')
      }
    </ul>
  </section>
`;

export default Object.entries(sections).map(renderSection).join('');
