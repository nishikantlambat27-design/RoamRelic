# RoamRelic - Heritage & Tourism PWA

A mobile-first Progressive Web Application (PWA) for heritage tourism, featuring interactive maps, audio guides, and civic engagement features.

## 🌟 Features

### Core Functionality
- **Interactive Map**: Explore heritage sites with current location and navigation
- **Audio Guides**: Listen to narrated stories about historical locations
- **POI Details**: Detailed information about heritage sites with images and descriptions
- **Civic Actions**: Engage with community through reporting, volunteering, and petitions

### Mobile-First Design
- **Responsive Layout**: Optimized for phone screens (iOS and Android)
- **Touch-Friendly UI**: Minimum 44px touch targets for accessibility
- **Bottom Navigation**: Easy thumb navigation for mobile devices
- **Safe Area Support**: Proper handling of iPhone notches and Android navigation bars

### PWA Capabilities
- **Offline Support**: Service worker for offline functionality
- **Install Prompt**: Can be installed as native app on mobile devices
- **App-like Experience**: Standalone display mode with custom splash screen

## 📱 Screens

The application includes 4 main screens matching the provided design:

1. **Home Screen** - Interactive map with heritage locations
2. **POI Detail Screen** - Detailed heritage site information
3. **Audio Player Screen** - Media player for heritage narrations
4. **Civic Actions Screen** - Community engagement features

## 🛠 Technical Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **React Leaflet** for interactive maps
- **Service Workers** for PWA functionality
- **Mobile-first responsive design**

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Open in browser**
   - Navigate to `http://localhost:3000`
   - For mobile testing, use device emulation in browser DevTools

### Building for Production

```bash
npm run build
```

## 📱 PWA Testing

1. Build the production version: `npm run build`
2. Serve it using a local server
3. Test installation on mobile devices
4. Verify offline functionality

---

**Built for heritage preservation and community engagement**

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
