import { Link } from "react-router-dom";
import { ReactNode, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

interface Props {
  children?: ReactNode;
}

export default function Header({ children }: Props) {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    if (userInfo == null) return;
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);


      });
    });

  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);

  }

  const username = userInfo?.username;

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">

        <Link to="/" className="navbar-brand">Etusivu </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            
            <li className="nav-item">{children}</li>
            </ul>
            <ul className="navbar-nav ms-auto">
            
            {username && (
              <>
               <li className="nav-item">
              <Link to="/watchlist" className="nav-link">Oma lista</Link></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Profiili</a>

                <div className="dropdown-menu">

                  

                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={logout}>Kirjaudu ulos</button>
                </div>
              </li></>)}

            {!username && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Kirjaudu sisään</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Rekisteröidy</Link></li>
              </>
            )}


          </ul></div>
      </div></nav>
  );
}
