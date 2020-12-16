import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

import Home from "./components/Home";
import Story from "./components/Story";

/*--Styles--*/
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
      <header className="App-header" style={{height:'12rem', minHeight:"auto"}}>
        <h1 style={{marginBottom:'.5rem'}}>Mystery At Garden Hall</h1>
        <p style={{marginTop:'.5rem'}}>A choose your own adventure story</p>
        <nav>
          <NavLink exact to="/" activeClassName="active">Overview</NavLink>
          <NavLink exact to="/story" activeClassName="active">The Story</NavLink>

        </nav>
      </header>
      <Route render={(props) => {
        const { location } = props;
        return (
          <Switch location={location}>
            <Route exact path="/" component={Home} />
            <Route exact path="/story" component={Story} />
          </Switch>
        )}
      }
      />
        <footer>
          <div className="content-container">
           <span>Powered By: <a href="https://www.npmjs.com/package/question-tree-core" target="_blank" rel="noreferrer">question-tree-core</a></span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
