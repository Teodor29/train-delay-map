/* global L */

import { baseURL } from "../utils.js";

export default class Map extends HTMLElement {
    constructor() {
        super();

        this.stations = {};
        this.delayedTrains = [];
        this.map = null;
        this.markers = [];
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
                (delay) => delay.LocationSignature === station.LocationSignature
            );
            if (delays) {
                station.delay = delays;
            } else {
                station.delay = null;
            }
            return station;
        });

        console.log("Stations:", this.stations);

        const socket = io("https://trafik.emilfolino.se");

        socket.on("position", (data) => {
            if (data) {
                this.renderDelayedTrain(data);
            }
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

            this.delayedMarkersLayer = L.layerGroup().addTo(this.map);

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
                    initMap(59.274793160440225, 17.85712622996837, 10);
                }
            );
        } else {
            initMap(59.274793160440225, 17.85712622996837, 10);
        }
    }

    async renderDelayedTrain(data) {
        this.delayedMarkersLayer.clearLayers();

        this.delayedTrains = this.delayedTrains.filter(
            (train) => train.train !== data.train
        );

        this.delayedTrains.push(data);

        this.delayedTrains.forEach((train) => {
            L.marker([train.position[0], train.position[1]], {
                color: "red",
            })
                .on("click", () => {
                    const popup = document.getElementById("popup-div");
                    popup.innerHTML = `
                    <button class="close" id="close-popup">&times;</button>
                    <h3>Tåg nr: ${train.train}</h3>
                    <span>Försenad</span>
                `;
                    popup.style.display = "block";
                    document.getElementById("close-popup").onclick = () => {
                        popup.style.display = "none";
                    };
                })
                .addTo(this.delayedMarkersLayer);
        });
    }

    async renderMarkers() {
        const trainIcon = L.divIcon({
            html: `<div>
                        <img src="assets/img/train.svg" alt="Train" />
                   </div>`,
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        this.stations.forEach((station) => {
            if (station.delay) {
                trainIcon.options.className = "train-marker delayed";
            } else {
                trainIcon.options.className = "train-marker";
            }

            const pointString = station.Geometry.WGS84;
            const coords = pointString
                .replace("POINT (", "")
                .replace(")", "")
                .split(" ");
            L.marker([parseFloat(coords[1]), parseFloat(coords[0])], {
                icon: trainIcon,
            })
                .on("click", () => {
                    const popup = document.getElementById("popup-div");
                    let delayMessage = "Ingen Försening";
                    let estimatedTime = "";

                    if (station.delay) {
                        let advertised = new Date(
                            station.delay.AdvertisedTimeAtLocation
                        );
                        let estimated = new Date(
                            station.delay.EstimatedTimeAtLocation
                        );
                        let delay = (estimated - advertised) / 60000;
                        delayMessage = `Försenad: ${delay} minuter`;
                        estimatedTime = `Förväntad ankomst: ${estimated.toLocaleTimeString(
                            "sv-SE"
                        )}`;
                    }

                    popup.innerHTML = `
                        <button class="close" id="close-popup">&times;</button>
                        <h3>${station.AdvertisedLocationName}</h3>
                        <p>${delayMessage}</p>
                        <p>${estimatedTime}</p>
                        <button id="save-station">
                            <img src="assets/img/saved.svg" alt="Spara">
                            Spara
                        </button>
                    `;
                    popup.style.display = "block";
                    document.getElementById("close-popup").onclick = () => {
                        popup.style.display = "none";
                    };
                })
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
