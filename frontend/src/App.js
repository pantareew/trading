//This is the route of the website
import { Navbar, Footer } from "./components";
import {
  Home,
  Login,
  Profile,
  Transaction,
  Checkout,
  AssetProfile,
} from "./pages";
import { User } from "./contexts/User";
import { Routes, Route, BrowserRouter } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <User>
        {/* The Navbar and Footer have been placed outside the routes as they appear in every pages */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/users/:username" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/assets/:asset_id" element={<AssetProfile />} />
        </Routes>
        <Footer />
      </User>
    </BrowserRouter>
  );
}
