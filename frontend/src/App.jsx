import { Routes, Route } from "react-router-dom";
import PollList from "./pages/PollList";
import PollDetails from "./pages/PollDetails";
import Results from "./pages/Results";
import CreatePoll from "./pages/CreatePolls";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PollList />} />
      <Route path="/create" element={<CreatePoll />} />
      <Route path="/pollDetails/:id" element={<PollDetails />} />
      <Route path="/poll/:id/results" element={<Results />} />
    </Routes>
  );
}

export default App;
