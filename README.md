# Train Delay Map

A web application for displaying train delays on an interactive map.

**Live demo:** https://teodor29.github.io/train-delay-map/

## Features

- **Interactive Map** - Display train delays on a map using Leaflet
- **Authentication** - Login and register users
- **Saved Locations** - Save and manage favorite locations
- **Real-time Updates** - Receive updates via Socket.io

## Technologies

- Vanilla JavaScript (ES6 modules)
- Leaflet (maps)
- Socket.io (real-time communication)
- SCSS (styling)

## Installation
To run the project locally:

1. Clone the repository:
```
git clone https://github.com/Teodor29/train-delay-map.git
```
2. Navigate to the project folder:
```
cd train-delay-map
```
3. Install dependencies:
```
npm install
```
4. Set up configuration:
```
cp src/utils.example.js src/utils.js
```
Then edit `src/utils.js` and add your API key and configuration values.

5. Start the development server:
```
npm start
```

The application runs on `http://localhost:8080`

## Scripts

- `npm start` - Starts live-server on port 8080
- `npm run eslint` - Run ESLint
- `npm run stylelint` - Run Stylelint
- `npm run htmlhint` - Run HTMLHint
