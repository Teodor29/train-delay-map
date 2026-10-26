export default class MapView extends HTMLElement {
  // connect component
  connectedCallback() {
    this.innerHTML = `<main class="main">
                                <map-display></map-display>
                                <div class="popup-div" id="popup-div"></div>
                             </main>
                             `
  }
}
