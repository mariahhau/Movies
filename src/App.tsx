import { UserContextProvider } from "./UserContext";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WatchListPage from "./pages/WatchlistPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/watchlist" element={<WatchListPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
