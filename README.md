# Pakistan Terror Tracker - Frontend

A comprehensive React.js frontend application for tracking and analyzing terror incidents across Pakistan. This application provides statistical insights through data visualization and interactive dashboards.

## Features

### Dashboard Components
- **Statistics Cards**: Key metrics display (Total Attacks, Fatalities, Hotspot Areas, Active Groups)
- **Latest Incidents**: Real-time feed of recent incidents
- **Pakistan Map**: Interactive map with region selection
- **Attack Type Chart**: Bar chart showing attacks by terrorist groups
- **Casualties Chart**: Pie chart displaying regional casualty distribution
- **Regional Breakdown**: Donut chart showing attack distribution by provinces
- **Monthly Trends**: Area chart showing attack trends over time
- **Heatmap Section**: Visual representation of hotspot areas in KP and Balochistan

### Form Components
- **Incident Form**: Comprehensive form for adding new incidents with validation
- **Multi-step validation**: Form validation using Yup schema
- **Real-time calculations**: Automatic casualty totals
- **Responsive design**: Mobile-first approach

### Technical Features
- **Dark Theme**: Modern dark UI with consistent styling
- **Responsive Design**: Works on all device sizes
- **Interactive Charts**: Powered by Recharts library
- **Form Validation**: Comprehensive validation with error handling
- **Toast Notifications**: User feedback for actions
- **Loading States**: Proper loading indicators

## Tech Stack

- **React 19**: Latest React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **React Hook Form**: Form handling with validation
- **Yup**: Schema validation
- **React Router**: Client-side routing
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications
- **Date-fns**: Date manipulation utilities

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TerrorTrackerFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── charts/           # Chart components
│   │   ├── AttackTypeChart.jsx
│   │   ├── CasualtiesChart.jsx
│   │   ├── RegionalBreakdown.jsx
│   │   └── MonthlyTrends.jsx
│   ├── Dashboard.jsx     # Main dashboard component
│   ├── Header.jsx        # Navigation header
│   ├── IncidentForm.jsx  # Incident submission form
│   ├── LatestIncidents.jsx
│   ├── PakistanMap.jsx
│   ├── StatisticsCards.jsx
│   └── HeatmapSection.jsx
├── App.jsx              # Main app component
├── App.css              # Custom styles
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Component Breakdown

### Dashboard.jsx
Main dashboard component that orchestrates all other components:
- Manages dashboard state and data
- Handles loading states
- Responsive grid layout
- Action bar with filters

### Header.jsx
Navigation header with:
- Logo and application title
- Navigation buttons
- Add incident link

### StatisticsCards.jsx
Displays key metrics in card format:
- Total Attacks
- Total Fatalities
- Hotspot Areas
- Active Groups

### LatestIncidents.jsx
Shows recent incidents with:
- Incident descriptions
- Dates and locations
- Interactive hover effects

### PakistanMap.jsx
Interactive map component with:
- Region selection dropdown
- Visual region indicators
- Responsive design

### Chart Components
Located in `components/charts/`:
- **AttackTypeChart**: Bar chart for group analysis
- **CasualtiesChart**: Pie chart for casualty distribution
- **RegionalBreakdown**: Donut chart for regional analysis
- **MonthlyTrends**: Area chart for time trends

### IncidentForm.jsx
Comprehensive form for adding incidents:
- Multi-section form layout
- Real-time validation
- Auto-calculated totals
- File upload support (ready for implementation)

## API Integration

The frontend is designed to work with the backend API. Key endpoints:

- `GET /api/v1/incidents` - Fetch incidents
- `POST /api/v1/incidents` - Create new incident
- `GET /api/v1/stats/overview` - Dashboard statistics
- `GET /api/v1/stats/by-region` - Regional statistics

## Styling

The application uses Tailwind CSS with custom utilities:
- Dark theme colors
- Responsive design
- Custom animations
- Form styling
- Chart customization

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Add proper error handling
- Include loading states

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   The built files are in the `dist` directory and can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
