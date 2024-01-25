import React, { PropsWithChildren } from "react";
import secureLocalStorage from "react-secure-storage";



const defaultContext = {
  token: ""
};

const AuthContext = React.createContext<{
  token: string;
}>(defaultContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = React.useState(defaultContext.token);

  const value = React.useMemo(() => ({ token }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
