import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from '@apollo/client';

//create an Apollo Client instance
const client = new ApolloClient({
    link: new HttpLink({
        uri: "/api/graphql",
        credentials: "same-origin",
    }),
    cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter basename={process.env.NODE_ENV === 'production' ? "/liste" : "/"} >
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
