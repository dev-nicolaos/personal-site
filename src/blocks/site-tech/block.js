export default (items) =>
  items.map(({ name, url }) => `
    <li class="site-tech_item">
      <a class="link" href="${url}" rel="noreferrer" target="_blank">
        ${name}
      </a>
    </li>
  `).join('');
