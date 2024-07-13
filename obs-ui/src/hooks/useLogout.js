import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    // Remove user from storage
    localStorage.removeItem("token");

    // Update auth context
    dispatch({ type: "LOGOUT" });
  };

  return logout;
};
