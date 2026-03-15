# React Frontend - Heroes & Missions Game

A React-based strategic game application where players create teams of heroes and execute missions to accumulate points and compete on leaderboards.

## Project Description

This is an interactive web application built with React that features:

- **Heroes & Missions Management**: Browse and view detailed information about available heroes and missions
- **Team Creation**: Assemble custom teams by selecting heroes with different stat attributes (Strength, Speed, Agility, Endurance, Brain)
- **Mission Gameplay**: Execute strategic missions with your team, with success/failure outcomes based on stat requirements
- **Game History**: Track all completed games with scores, team compositions, and timestamps
- **Analytics Dashboard**: View comprehensive game statistics and performance metrics
- **Team Leaderboard**: Compete with other teams on a ranked leaderboard
- **Responsive Design**: Pixel-art inspired UI with custom SVG assets and animations

## Tech Stack

- **Frontend**: React.js
- **Styling**: CSS with Pixelify Sans custom font
- **HTTP Client**: Axios
- **Routing**: React Router
- **Backend API**: RESTful API (separate backend required)

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-frontend
```

Replace `<repository-url>` with the actual GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Configure API Endpoint

Open `src/` and check your component files to ensure the API base URL is correctly configured. By default, axios should be pointing to your backend server (typically `http://localhost:3000/api` or similar).

### 4. Start the Development Server

```bash
npm start
```

The application will automatically open in your default browser at `http://localhost:3000`

### 5. Build for Production

To create an optimized production build:

```bash
npm run build
```

The build folder will contain the production-ready files ready for deployment.

## Available Scripts

- `npm start` - Run development server with hot reload
- `npm run build` - Create production build
- `npm test` - Run tests (if configured)
- `npm eject` - Eject from Create React App (not reversible)

## Project Structure

```
src/
├── App.js              # Main app component
├── App.css             # Global styles and component styles
├── index.js            # Entry point
├── components/         # React components
│   ├── HeroesMissions.js
│   ├── NewGame.js
│   ├── GamePlay.js
│   ├── GameHistory.js
│   ├── AnalyticsDashboard.js
│   ├── TeamLeaderboard.js
│   ├── About.js
│   └── ...
├── context/            # React Context (state management)
│   └── HeroesContext.jsx
└── public/
    └── assets/         # SVG and image assets
        ├── heroes-and-mission/
        ├── main-menu/
        ├── new-game/
        ├── game-history/
        └── ...
```

## API Requirements

This frontend requires a backend API with the following endpoints:

- `GET /api/heroes` - Fetch all available heroes
- `GET /api/missions` - Fetch all available missions
- `POST /api/games` - Create/submit a new game
- `GET /api/games` - Fetch game history
- `GET /api/leaderboard` - Fetch team leaderboard
- Additional endpoints as needed

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm start
```

### API Connection Issues

- Ensure the backend server is running
- Check that the API base URL in the components matches your backend URL
- Check browser console (F12) for CORS or network errors

### Missing Assets

Ensure all SVG files are present in `public/assets/` directory:
- `heroes-and-mission/`
- `main-menu/`
- `game-history/`
- `new-game/`
- And other asset folders

### Dependencies Not Installing

Try clearing npm cache:

```bash
npm cache clean --force
npm install
```

## Features

✨ **Implemented**
- Hero browsing with stats display
- Mission information display
- New game creation form
- Team selection interface
- Gameplay round execution
- Mission result tracking
- Game history viewing
- Team leaderboard
- Analytics dashboard
- HOver effects for card information

## Deployment

To deploy this application:

1. Build the project: `npm run build`
2. Upload the `build/` folder contents to your hosting provider (Vercel, Netlify, GitHub Pages, etc.)
3. Ensure the backend API URL is correctly configured for the production environment

## Contributing

When contributing to this project:

1. Create a new branch for your feature
2. Follow the existing code style and structure
3. Test your changes thoroughly
4. Submit a pull request with a clear description


## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Last Updated**: March 2026
