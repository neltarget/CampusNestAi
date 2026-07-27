import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ResultsPage } from "./pages/ResultsPage";
import { ListingDetailsPage } from "./pages/ListingDetailsPage";
import { ListingWorkerPage } from "./pages/ListingWorkerPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/listing/:id" element={<ListingDetailsPage />} />
          <Route path="/landlord/listing" element={<ListingWorkerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
