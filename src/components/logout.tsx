import { Navigate } from "react-router-dom";

export default function Logout() {
    localStorage.removeItem('authToken');
  return (
    Navigate({ to: "/", replace: true })
  );
}