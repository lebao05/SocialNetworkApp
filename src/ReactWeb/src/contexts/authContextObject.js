import { createContext } from "react";

// Plain React context object (separate module so `authContext.jsx` only
// exports a component, which keeps react-refresh / fast-refresh happy and
// also lets non-component callers import the context directly if needed).
const AuthContext = createContext(null);

export default AuthContext;
