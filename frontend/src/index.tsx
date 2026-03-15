import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from '@apollo/client';
import { AuthProvider } from './context/AuthContext';

//create an Apollo Client instance that is use to access the Graphql backend
const GRAPHQL_URI = process.env.REACT_APP_BACKEND_URL;
if (!GRAPHQL_URI) {
    console.error("REACT_APP_BACKEND_URL is not defined in the environment variables");
}
const client = new ApolloClient({
    link: new HttpLink({
        uri: GRAPHQL_URI,
        credentials: "include",
    }),
    cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <HashRouter basename= "/" >
        <ApolloProvider client={client}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ApolloProvider>
    </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
