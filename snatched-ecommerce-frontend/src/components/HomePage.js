import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <main className="main-content">
        <div className="slogan">
          <h1>Confort et style intemporel.</h1>
        </div>
        <div className="buttons-container">
          <button className="btn-homme">Homme</button>
          <button className="btn-femme">Femme</button>
        </div>
        <div className="offer-banner">
          <h2>OFFRE DE 20% DE REMISE NOUVEAU CLIENT</h2>
        </div>
        <button className="btn-nouveaute">Nouveauté</button>
      </main>
    </div>
  );
}

export default HomePage;
