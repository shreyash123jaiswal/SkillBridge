import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./components/Roadmap";

// 🔐 Fake auth check (replace later with real auth)
const isAuthenticated = () => {
  return localStorage.getItem("user"); // or token
};

// 🔐 Protected Route Wrapper
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* 🌐 PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* 🔒 PROTECTED DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;