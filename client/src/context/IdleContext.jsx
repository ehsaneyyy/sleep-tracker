import { createContext, useContext, useState } from "react";

const IdleContext = createContext();

export function IdleProvider({ children }) {
    const [idleState, setIdleState] = useState("active");

    return (
        <IdleContext.Provider value={{ idleState, setIdleState }}>
            {children}
        </IdleContext.Provider>
    );
}

export const useIdle = () => useContext(IdleContext);