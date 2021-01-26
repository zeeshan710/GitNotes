import './App.css';
import Routes from './router/Routes'
import { Provider } from 'react-redux';
import store from './redux/store'
import React from 'react'

function App() {
  return (
    <Provider store={store} >
      <Routes />
    </Provider>
  )
}

export default App;
