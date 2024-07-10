import React from 'react';
import InteractiveMap from './components/InteractiveMap';
import './App.scss';
import BostonBingo from "./components/BostonBingo";

function App() {
  return (
    <div className="App">
      <h1>Kim Goes to Boston!</h1>
      {/*<InteractiveMap />*/}
      <BostonBingo />
    </div>
  );
}

export default App;
