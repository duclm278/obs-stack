import * as React from "react";
import { AuthContext } from "../providers/auth-provider";

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  return context;
};
