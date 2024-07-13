import * as React from "react";

export const AuthContext = React.createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { token: action.payload };
    case "LOGOUT":
      return { token: null };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = React.useReducer(authReducer, {
    token: localStorage.getItem("token"),
  });

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch({ type: "LOGIN", payload: token });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
