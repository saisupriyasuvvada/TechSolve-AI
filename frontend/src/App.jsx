import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AnalyzeVideo from "./pages/AnalyzeVideo";
import AnalyzeReel from "./pages/AnalyzeReel";
import AskQuestion from "./pages/AskQuestion";
import Engagement from "./pages/Engagement";
import AnalyzeBoth from "./pages/AnalyzeBoth";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/video"
          element={<AnalyzeVideo />}
        />

        <Route
          path="/reel"
          element={<AnalyzeReel />}
        />

        <Route
          path="/compare"
          element={<AnalyzeBoth />}
        />

        <Route
          path="/question"
          element={<AskQuestion />}
        />

        <Route
          path="/engagement"
          element={<Engagement />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;