// Importing required modules
import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface AuthContextType {
    authUser: any;
    setAuthUser: React.Dispatch< React.SetStateAction<any> >;
}

// Creating and Exporting a custom context with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creating and Exporting a custom hook for the context
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
}

// Props for AuthContextProvider
interface AuthContextProviderProps {
    children: ReactNode;
}

// Creating and Exporting a custom context provider
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    // Some states to handle Provider operations
    const [authUser, setAuthUser] = useState<any>(JSON.parse(localStorage.getItem("authUserInfo") || 'null'));

    // Return the provider with some values as an Object
    return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>
}
