
/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';
// import './App.css';

// i18n
import 'src/locales/i18n';

// ----------------------------------------------------------------------

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import Router from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';
import { store } from 'src/store/store';
import { LocalizationProvider } from 'src/locales';
import { AuthProvider } from 'src/auth/context/jwt';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import packageJson from "../package.json";

// ----------------------------------------------------------------------

function App() {

  useScrollToTop();

  console.log(`%cWelcome to Demo Administrator version : ${packageJson.version}`, 'color:rgb(218, 85, 85); font-size: 20px;');

  const caching = () => {
    const version = localStorage.getItem('version');
    if (version !== packageJson.version) {
      // console.log("🚀 ~ file: App.tsx:39 ~ caching ~ version:", version)
      // console.log("🚀 ~ file: App.tsx:39 ~ caching ~  packageJson.version:", packageJson.version)
      if ('caches' in window) {
        caches.keys().then((names) => {
          // console.log("🚀 ~ file: App.tsx:43 ~ caches.keys ~ names:", names)
          // Delete all the cache files
          names.forEach(name => {
            caches.delete(name);
          })
        });

        // Makes sure the page reloads. Changes are only visible after you refresh.
        window.location.reload();
      }

      localStorage.clear();
      localStorage.setItem('version', packageJson.version);
    }

    // console.log("🚀 ~ file: App.tsx:39 ~ caching else  ~ version:", version)
    // console.log("🚀 ~ file: App.tsx:39 ~ caching else ~  packageJson.version:", packageJson.version)
  };

  useEffect(() => {

    caching();

    return () => {

    };
  }, []);


  return (
    <Provider store={store}>
      <LocalizationProvider>
        <AuthProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light', // 'light' | 'dark'
              themeDirection: 'ltr', //  'rtl' | 'ltr'
              themeContrast: 'default', // 'default' | 'bold'
              themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
              themeColorPresets: 'orange', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
              themeStretch: true,
            }}
          >
            <ThemeProvider>
              <MotionLazy>
                <SnackbarProvider>
                  <SettingsDrawer />
                  <ProgressBar />
                  <Router />
                </SnackbarProvider>
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </LocalizationProvider>
    </Provider>
  );
}

export default App
