import { utilityBeltItems } from "./items.js";

const mapObject = (obj, func) =>
  Object.keys(obj).map((key, index) => func(obj[key], key, index, obj));

const renderAccordionSection = (items, sectionName, index) => `
  <details class="accordion-section" ${index === 0 ? "open" : ""}>
    <summary>
      <h2 class="accordion-section-heading">
        <span>${sectionName}</span>
        <span class="accordion-icon"></span>
      </h2>
    </summary>
    <ul class="accordion-section-list">
      ${items.reduce(
        (html, item) => (html += `
          <li class="accordion-list-item">
            <a target="_blank" href="${item.url}" rel="noopener">${item.name}</a>
          </li>
        `), "",
      )}
    </ul>
  </details>
`;

class UtilityBelt extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = mapObject(utilityBeltItems, renderAccordionSection).join("");
    this.querySelectorAll("summary").forEach(el =>
      el.addEventListener("click", e => {
        e.preventDefault();
        const mobile = getComputedStyle(this, "::after").content === "none";
        const currentlyOpen = this.querySelector("[open]");
        const targetAlreadyOpen = e.currentTarget.parentElement === currentlyOpen;

        if (mobile) {
          e.currentTarget.parentElement.toggleAttribute("open");
          if (!targetAlreadyOpen) {
            currentlyOpen.removeAttribute("open");
          }
        } else if (!targetAlreadyOpen) {
          e.currentTarget.parentElement.toggleAttribute("open");
          currentlyOpen.removeAttribute("open");
        }
      }),
    );
  }
}

customElements.define("utility-belt", UtilityBelt);
