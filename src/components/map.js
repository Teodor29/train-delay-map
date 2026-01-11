/* global L, io */
import { baseURL } from "../utils.js";

export default class Map extends HTMLElement {
  constructor() {
    super();

    this.delayedTrains = [];
    this.map = null;
    this.circle = null;
    this.delay = null;
    this.delayFromNow = null;
  }

  async connectedCallback() {
    const socket = io("https://trafik.emilfolino.se");

    socket.on("position", (data) => {
      if (data) {
        this.renderDelayedTrainMarkers(data);
      }
    });

    this.innerHTML = `<div id="map" class="map"></div>`;

    this.renderMap();

    setInterval(async () => {
      await this.renderStationMarkers();
    }, 60000);
  }

  async renderMap() {
    const initMap = async (lat, lon, zoom) => {
      this.map = L.map("map").setView([lat, lon], zoom);

      this.map.on("click", () => {
        const popup = document.getElementById("popup-div");
        if (popup) {
          popup.style.display = "none";
        }
        if (this.circle) {
          this.map.removeLayer(this.circle);
        }
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);

      this.delayedMarkersLayer = L.layerGroup().addTo(this.map);
      this.stationMarkersLayer = L.layerGroup().addTo(this.map);

      await this.renderStationMarkers();
      this.renderLocation();
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initMap(position.coords.latitude, position.coords.longitude, 11);
        },
        () => {
          initMap(59.274793160440225, 17.85712622996837, 10);
        }
      );
    } else {
      initMap(59.274793160440225, 17.85712622996837, 10);
    }
  }

  async renderDelayedTrainMarkers(data) {
    if (this.delayedMarkersLayer) {
      this.delayedMarkersLayer.clearLayers();
    } else {
      window.location.reload();
    }

    this.delayedTrains = this.delayedTrains.filter(
      (train) => train.train !== data.train
    );

    this.delayedTrains.push(data);

    this.delayedTrains.forEach((train) => {
      const lat = train.position[0];
      const lon = train.position[1];
      L.marker([lat, lon], {
        color: "red",
      })
        .on("click", () => {
          this.map.setView([lat, lon]);

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

  async renderStationMarkers() {
    this.stationMarkersLayer.clearLayers();

    let response = await fetch(`${baseURL}/stations`);
    let result = await response.json();

    let stationsData = result.data;

    response = await fetch(`${baseURL}/delayed`);
    result = await response.json();

    let delayedData = result.data;

    let stations = stationsData.map((station) => {
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

    const trainIcon = L.divIcon({
      html: `<div>
                        <img src="assets/img/train.svg" alt="Train" />
                   </div>`,
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    stations.forEach((station) => {
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
      const lat = parseFloat(coords[1]);
      const lon = parseFloat(coords[0]);

      const marker = L.marker([lat, lon], {
        icon: trainIcon,
      }).on("click", () => {
        this.map.setView([lat, lon]);

        if (this.circle) {
          this.map.removeLayer(this.circle);
        }

        const popup = document.getElementById("popup-div");
        popup.innerHTML = this.createStationPopupContent(station);

        if (station.delay) {
          const radius = (100 * this.delayFromNow) / 2 - 100;
          if (this.circle) {
            this.map.removeLayer(this.circle);
          }
          this.circle = L.circle([lat, lon], {
            color: "green",
            fillColor: "lightgreen",
            fillOpacity: 0.2,
            radius: radius,
          }).addTo(this.map);
        }

        popup.style.display = "block";
        document.getElementById("close-popup").onclick = () => {
          popup.style.display = "none";
          if (this.circle) {
            this.map.removeLayer(this.circle);
          }
        };

        const saveBtn = document.getElementById("save-station");
        if (saveBtn) {
          saveBtn.onclick = () => {
            this.addStation(station);
            saveBtn.outerHTML = `
                                <a href="#saved" class="button">
                                    <img src="assets/img/saved-check.svg" alt="Saved">
                                    Sparad
                                </a>
                            `;
          };
        }
      });

      this.stationMarkersLayer.addLayer(marker);
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
        L.marker([position.coords.latitude, position.coords.longitude], {
          icon: locationMarker,
        }).addTo(this.map);
      });
    }
  }

  addStation(station) {
    let savedStations = JSON.parse(localStorage.getItem("savedStations")) || [];
    if (
      !savedStations.find(
        (s) => s.LocationSignature === station.LocationSignature
      )
    ) {
      savedStations.push(station);
      localStorage.setItem("savedStations", JSON.stringify(savedStations));
    }
  }

  createStationPopupContent(station) {
    let delayMessage = "Ingen Försening";
    let estimatedTime = "";
    let extraMessage = "";
    let button = `<button id="save-station">
                <img src="assets/img/saved.svg" alt="Spara">
                Spara
            </button>`;
    let savedStations = JSON.parse(localStorage.getItem("savedStations")) || [];

    if (
      savedStations.find(
        (s) => s.AdvertisedLocationName === station.AdvertisedLocationName
      )
    ) {
      button = `<a href="#saved" class="button">
                        <img src="assets/img/saved-check.svg" alt="Ta bort">
                        sparad
                    </a>`;
    }

    if (station.delay) {
      let advertised = new Date(station.delay.AdvertisedTimeAtLocation);
      let estimated = new Date(station.delay.EstimatedTimeAtLocation);
      let current = new Date();
      this.delay = Math.round((estimated - advertised) / 60000);
      this.delayFromNow = Math.round((estimated - current) / 60000);

      if (this.delayFromNow > 5) {
        let safeTimeDate = new Date(
          estimated.getTime() - (this.delayFromNow / 2 + 2) * 60000
        );
        let safeTime = safeTimeDate.toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
        });

        extraMessage = `
                    <h4>Utnyttja tiden</h4>
                    <p>Håll dig innanför den gröna cirkeln och börja gå mot stationen senast ${safeTime} för att hinna till tåget</p>
                `;
      }

      delayMessage = `Försenad: ${this.delay} minuter`;
      estimatedTime = `${estimated.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return `
            <button class="close" id="close-popup">&times;</button>
            <div>
                <h2>${station.AdvertisedLocationName}</h2>
                <p>${delayMessage}</p>
                <p>${estimatedTime}</p>
            </div>
            <div>
                ${button}
            </div>
            <div>
                ${extraMessage}
            </div>
        `;
  }
}
