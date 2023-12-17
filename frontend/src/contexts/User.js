import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const User = ({ children }) => {
  const [userData, setUser] = useState(null);
  const updateUser = (user) => {
    setUser(user);
  };
  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
