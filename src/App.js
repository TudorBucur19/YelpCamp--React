import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import CampgroundsContextProvider from './contexts/CampgroundsContext';
import SwitchRoutes from './routing/SwitchRoutes';
import { ROUTES } from './routing/Routes';

function App() {
  return (
    <Router>
      <div className="App">
        <CampgroundsContextProvider>
          <SwitchRoutes routes={ROUTES}/> 
        </CampgroundsContextProvider>
        
      </div>
    </Router>
  );
}

export default App;
