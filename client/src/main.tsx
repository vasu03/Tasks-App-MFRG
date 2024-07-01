// Importing required modules
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

// Importing context providers
import { AuthContextProvider } from "./contexts/authContext";
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// /Importing the React App & it"s assets
import App from './App.tsx'
import "./index.css"

// Initializing react-query
const queryClient = new QueryClient();

// Creating a single paged root element
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
