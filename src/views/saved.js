export default class SavedView extends HTMLElement {
    // connect component
    connectedCallback() {
        this.innerHTML = `<header class="header">
                                <lager-title title="Home"></lager-title>
                             </header>
                             <main class="main">
                                <h1>Saved</h1>
                             </main>
                             `;
    }
}
