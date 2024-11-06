import React from 'react';
import './Login.css';
function Login() {
  return (
    <div className="login-page">
      <h2>Connexion</h2>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Entrez votre email" />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" placeholder="Entrez votre mot de passe" />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
