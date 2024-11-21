'use client';

import Header from './components/Header';
import Body from './components/Body';
import './stylesheets/Wrapper.css';
import {AuthProvider} from '../context/AuthContext'; // Import AuthProvider
import {ToastContainer} from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

function App() {
    return (
        <AuthProvider>
            <div id='wrapper'>
                <Header/>
                <Body/>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={true}
                    closeOnClick={true}
                    pauseOnHover={true}
                    draggable={true}
                    theme="light"
                />
            </div>
        </AuthProvider>
    );
}

export default App;
