import Auth from "./Pages/Auth";
import { Routes, Route, Link } from "react-router-dom";
import EmailVerification from "./Components/Auth/EmailVerification";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  return (
    <div >
      
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/emailVerification/:id" element={<EmailVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
