// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Components
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Hello from "./pages/Hello";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Projects />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/hello" element={<Hello />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
