export default class SavedView extends HTMLElement {
  connectedCallback() {
    const savedStations =
      JSON.parse(localStorage.getItem('savedStations')) || []
    this.innerHTML = `
            <header class="header">
                <lager-title title="Home"></lager-title>
            </header>
            <main class="main container">
                <saved-list></saved-list>
        ${
          savedStations.length > 0
            ? '<button class="btn-big bg-red" id="clear-fav">Rensa stationer</button>'
            : '<p class="center">Inga sparade stationer</p>'
        }
            </main>
        `

    document.getElementById('clear-fav').addEventListener('click', () => {
      if (
        confirm('Är du säker på att du vill ta bort alla sparade stationer?')
      ) {
        localStorage.removeItem('savedStations')
        window.location.reload()
      }
    })
  }
}
