import { apiKey, baseURL } from "../utils.js";

export default class SavedList extends HTMLElement {
    constructor() {
        super();

        this.orders = [];
    }

    async connectedCallback() {
        this.savedStations =
            JSON.parse(localStorage.getItem("savedStations")) || [];

        this.render();
    }

    render() {
        const list = this.savedStations
            .map((station) => {
                let delayMessage = "";

                if (station.delay) {
                    let advertised = new Date(
                        station.delay.AdvertisedTimeAtLocation
                    );
                    let estimated = new Date(
                        station.delay.EstimatedTimeAtLocation
                    );
                    let delay = (estimated - advertised) / 60000;
                    delayMessage = `Försenad: ${delay} minuter`;
                }

                return `<div class="station">
                        <div class="train-marker">
                            <div>
                                <img src="assets/img/train.svg" alt="Train" />
                            </div>
                        </div>
                        <div class="station-info">
                            <h3>${station.AdvertisedLocationName}</h3>
                            <span>${delayMessage}</span>
                        </div>
                    </div>`;
            })
            .join("");

        this.innerHTML = `
          <div class="saved-stations">
            ${list}
          </div>
        `;
    }
}
