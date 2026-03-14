import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { gql } from 'graphql-tag';

export interface User {
    id: string;
    email: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}


type AuthResponse = {
    authenticateUserWithPassword: UserAuthSuccess | UserAuthFailure;
}

type UserAuthSuccess = {
    __typename: 'UserAuthenticationWithPasswordSuccess';
    sessionToken: string;
    item: User;
};

type UserAuthFailure = {
    __typename: 'UserAuthenticationWithPasswordFailure';
    message: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const client = useApolloClient();

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);


    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data, error} =  await client.mutate<AuthResponse>({
                mutation: gql`
                            mutation LoginUser($email: String!, $password: String!) {
              authenticateUserWithPassword(email: $email, password: $password) {
                ... on UserAuthenticationWithPasswordSuccess {
                  sessionToken
                  item {
                    id
                    email
                    roles
                  }
                }
                ... on UserAuthenticationWithPasswordFailure {
                  message
                }
              }
            } `,
                variables: { email, password },
            });

            const result = data?.authenticateUserWithPassword;

            if (result?.__typename === 'UserAuthenticationWithPasswordSuccess') {
                setUser(result.item);

                // Store in localStorage
                localStorage.setItem('sessionToken', result.sessionToken);
                localStorage.setItem('user', JSON.stringify(result.item));
            } else if (result?.__typename === 'UserAuthenticationWithPasswordFailure') {
                throw new Error(result.message || 'Login failed');
            } else {
                throw new Error('Unexpected response from server', { cause: error });
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('user');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
