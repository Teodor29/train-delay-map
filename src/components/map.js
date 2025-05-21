import { baseURL } from "../utils.js";

import getCoordinates from "../models/nominatim.js";

export default class Map extends HTMLElement {
    constructor() {
        super();

        this.adress = "Norra Kungsgatan 1, Karlskrona";
        this.stations
        this.map = null;
    }

    async connectedCallback() {
        const response = await fetch(`${baseURL}/delayed`);
        const result = await response.json();

        this.stations = result.data;
        console.log(this.stations);
        this.innerHTML = `<div id="map" class="map"></div>`;

        this.renderMap();
    }

    async renderMap() {

        const initMap = (lat, lon, zoom) => {
            this.map = L.map("map").setView([lat, lon], zoom);

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(this.map);

            this.renderMarkers();
            this.renderLocation();
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    initMap(
                        position.coords.latitude,
                        position.coords.longitude,
                        11
                    );
                },
                () => {
                    initMap(59.2573124324539, 15.253606421268424, 6);
                }
            );
        } else {
            initMap(59.2573124324539, 15.253606421268424, 5);
        }
    }

    async renderMarkers() {
        const results = await getCoordinates(this.adress);

        if (results.length > 0) {
            L.marker([
                parseFloat(results[0].lat),
                parseFloat(results[0].lon),
            ]).addTo(this.map);
        } else {
            console.error("No address provided");
        }
    }

    renderLocation() {
        let locationMarker = L.icon({
            iconUrl: "assets/img/location.png",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, 0],
        });

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                L.marker(
                    [position.coords.latitude, position.coords.longitude],
                    { icon: locationMarker }
                ).addTo(this.map);
            });
        }
    }
}
