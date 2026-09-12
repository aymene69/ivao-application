import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { VidProvider } from './context/VidContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { VidInput } from './components/VidInput';
import { ThemeToggle } from './components/ThemeToggle';
import { FutureBookingsPage } from './pages/FutureBookingsPage';
import { DaySchedulePage } from './pages/DaySchedulePage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import ivaoLogo from './assets/ivao-logo.png';
import ivaoLogoDark from './assets/ivao-logo-dark.png';
import './App.css';

function Brand() {
  const { theme } = useTheme();
  return (
    <div className="brand">
      <img src={theme === 'dark' ? ivaoLogoDark : ivaoLogo} alt="IVAO" className="brand-logo" />
      <h1>ATC Position Booking</h1>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <VidProvider>
        <BrowserRouter>
          <div className="app">
            <header className="app-header">
              <div className="app-header-top">
                <Brand />
                <div className="header-actions">
                  <VidInput />
                  <ThemeToggle />
                </div>
              </div>
              <nav className="tabs">
                <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  Day schedule
                </NavLink>
                <NavLink to="/future" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  Future bookings
                </NavLink>
                <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                  My bookings
                </NavLink>
              </nav>
            </header>

            <main>
              <Routes>
                <Route path="/" element={<DaySchedulePage />} />
                <Route path="/future" element={<FutureBookingsPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </VidProvider>
    </ThemeProvider>
  );
}
