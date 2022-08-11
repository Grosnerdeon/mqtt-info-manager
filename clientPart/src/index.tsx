import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './stores';
import * as serviceWorker from './serviceWorker';
import { WebSoceketService } from './services/websocetService';
import { Provider } from 'react-redux';
import './index.css';

const socet = new WebSoceketService(`ws://${window.location.hostname}:5001`);

ReactDOM.render(
    <Provider store={store}>
        <App />  
    </Provider>
    ,
    document.getElementById('root')
);

serviceWorker.unregister();