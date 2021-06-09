import React from 'react'
import './static/style/style.css'
import './static/style/mobile.css'
import HomePage from "./pages/HomePage";
import Landing from "./components/Landing";
import HomePageSection from "./components/HomePageSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <HomePage />
      <Landing />
      <HomePageSection />
      <Footer />
    </div>
  );
}

export default App;
