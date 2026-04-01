import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dataset from "./pages/Dataset";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route element={<MainLayout />}>
          <Route path="/project/:projectId" element={<Dataset />} />
          <Route
            path="/project/:projectId/chat/:chatId"
            element={<Chat />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
