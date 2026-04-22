export default class SavedView extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <header class="header">
                <lager-title title="Home"></lager-title>
            </header>
            <main class="main container">
                <h1>Sparade</h1>
                <saved-list></saved-list>
                <button class="btn-big bg-red" id="clear-fav">Rensa stationer</button>
            </main>
        `;

    document.getElementById("clear-fav").addEventListener("click", () => {
      if (
        confirm("Är du säker på att du vill ta bort alla sparade stationer?")
      ) {
        localStorage.removeItem("savedStations");
        window.location.reload();
      }
    });
  }
}
