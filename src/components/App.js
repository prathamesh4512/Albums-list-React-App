import "../styles/App.css";

import { Home } from "../pages";

function App() {
  return (
    <div className="App">
      <div className="header">
        <h2>Albums List</h2>
      </div>
      {/* Home Page  */}
      <Home />
    </div>
  );
}

export default App;
