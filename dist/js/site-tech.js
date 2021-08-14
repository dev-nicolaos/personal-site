const render = (items) =>
  items.map(({ name, url }) => `
    <li class="site-tech_item">
      <a class="link" href="${url}" rel="noreferrer" target="_blank">
        ${name}
      </a>
    </li>
  `).join('');

// TODO: remove IIFE when top level await has wide support
// https://caniuse.com/mdn-javascript_operators_await_top_level
(async () => {
  const response = await fetch('/assets/site-tech.json');
  const container = document.getElementById('site-tech_items');
  container.innerHTML = render(await response.json());
})();
