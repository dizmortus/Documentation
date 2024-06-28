import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainApp from './MainApp.jsx';
import DynamicPage from './DynamicPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainApp />} />
                <Route path="/page/:id" element={<DynamicPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;