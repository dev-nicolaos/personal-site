export default (items) => /*html*/`
  <ul id="site-tech_items">
    ${items.map(({ name, url }) => /*html*/`
      <li class="site-tech_item">
        <a class="link" href="${url}" rel="noreferrer" target="_blank">
          ${name}
        </a>
      </li>
    `).join('')}
  </ul>
`;
