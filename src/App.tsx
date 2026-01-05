import { UserProvider } from './auth/UserContext';
import { Router } from './Router';

export default function App() {
  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
}
