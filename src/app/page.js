'use client'

import Header from './components/Header';
import Body from './components/Body';
import './stylesheets/Wrapper.css';
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <AuthProvider> {/* Wrap the application with AuthProvider */}
      <div id='wrapper'>
        <Header />
        <Body />
      </div>
    </AuthProvider>
  );
}

export default App;
