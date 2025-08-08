import { Routes, Route } from "react-router-dom"
import NavBar from "./components/navBar"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
