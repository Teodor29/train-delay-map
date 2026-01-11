export default class MapView extends HTMLElement {
  // connect component
  connectedCallback() {
    this.innerHTML = `<header class="header">
                                <lager-title title="Home"></lager-title>
                             </header>
                             <main class="main">
                                <map-display></map-display>
                                <div class="popup-div" id="popup-div"></div>
                             </main>
                             `;
  }
}
