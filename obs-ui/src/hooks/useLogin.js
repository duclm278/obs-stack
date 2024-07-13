import authService from "../api/auth";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const { dispatch } = useAuthContext();

  const login = async (username, password) => {
    const token = await authService.login(username, password);

    // Save token to local storage
    localStorage.setItem("token", token);

    // Update auth context
    dispatch({ type: "LOGIN", payload: token });
  };

  return login;
};
