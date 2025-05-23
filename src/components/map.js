/* global L */

import { baseURL } from "../utils.js";

import getCoordinates from "../models/nominatim.js";

export default class Map extends HTMLElement {
    constructor() {
        super();

        this.stations = {};
        this.map = null;
    }

    async connectedCallback() {
        let response = await fetch(`${baseURL}/stations`);
        let result = await response.json();

        let stationsData = result.data;

        response = await fetch(`${baseURL}/delayed`);
        result = await response.json();

        let delayedData = result.data;

        this.stations = stationsData.map((station) => {
            let delays = delayedData.find(
                delay => delay.LocationSignature === station.LocationSignature
            );
            if (delays) {
                station.delay = delays;
            } else {
                station.delay = null;
            }
            return station;
        });

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
        const trainIcon = L.divIcon({
            className: "train-marker",
            html: `<div>
                        <img src="assets/img/train.svg" alt="Train" />
                   </div>`,
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        this.stations.forEach((station) => {
            const pointString = station.Geometry.WGS84;
            const cordString = pointString
                .replace("POINT (", "")
                .replace(")", "")
                .split(" ");
            L.marker([parseFloat(cordString[1]), parseFloat(cordString[0])], {
                icon: trainIcon,
            })
                .bindPopup(
                    `<div class="popup">
                        <h3>${station.AdvertisedLocationName}</h3>
                        <span>Delay: ${
                            station.delay?.ActivityId ?? "inga förseningar"
                        }</span>
                    </div>`
                )
                .openPopup()
                .addTo(this.map);
        });
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
