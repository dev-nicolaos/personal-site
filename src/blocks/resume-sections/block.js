const renderListItem = (content) =>
  /*html*/`<li class="resume-section_list-item">${content}</li>`;

const renderSublist = ([title, items]) => /*html*/`
  <li class="resume-section_sublist">
    <h4 class="resume-section_subtitle">${title}</h4>
    <ul class="resume-section_list">
      ${items.map(renderListItem).join('')}
    </ul>
  </li>
`;

const renderSection = ([title, items]) => /*html*/`
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

export default (sections) => Object.entries(sections).map(renderSection).join('');
