import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
const App = () => {
    return (React.createElement(Router, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(Home, null) }))));
};
export default App;
