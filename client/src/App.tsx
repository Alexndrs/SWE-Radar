import { Routes, Route } from "react-router-dom"
import NavBar from "./components/navBar"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"
import NewPage from "./pages/new"

function App() {
  return (
    <div className="dark min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new" element={<NewPage />} />
      </Routes>
    </div>
  )
}

export default App
