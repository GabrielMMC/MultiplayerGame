import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import Echo from "laravel-echo";
import ENV from "../../env";
import Pusher from "pusher-js";

interface EchoContextType {
  echo: Echo | null;
  setToken: Dispatch<SetStateAction<string>>;
}

const EchoContext = createContext<EchoContextType | undefined>(undefined);

export const EchoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [echo, setEcho] = useState<Echo | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (!token) return;

    window.Pusher = Pusher;
    const echoInstance = new Echo({
      broadcaster: "reverb",
      key: ENV.REVERB_APP_KEY,
      wsHost: ENV.REVERB_HOST,
      wsPort: ENV.REVERB_PORT ?? 80,
      wssPort: ENV.REVERB_PORT ?? 443,
      forceTLS: ENV.REVERB_SCHEME === "https",
      transports: ["websocket"],
      authEndpoint: "http://localhost:8000/broadcasting/auth",
      auth: {
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYWFjZGFhMmIzN2E2NDRhYTNkZjdhZTNkMmI1MjM2ZjA1YjZhOWYwZjNjMzE0ZDJkYzBmYzEwYzRiODdjYmEwYzFkNmIxOTdhZjQzMTBjNzMiLCJpYXQiOjE3MzExODIzNDIuOTE3NTQ1LCJuYmYiOjE3MzExODIzNDIuOTE3NTQ4LCJleHAiOjE3NjI3MTgzNDIuNzU4MjIsInN1YiI6IjUiLCJzY29wZXMiOltdfQ.SbjrW6uSaGzjwlAW6DLNIgsq3c3FQ3xW_kyrecdCKKGWxM6MvhqS_Pykf5XmuQq3dv_4rGHD3CjSInpqEsu8hWxNkZWWuXPn3iM53UdxnIz938PDypCBOlWnGRxWhPLdmP_mD55zKA6AWgwHPAwts9LuvACRCH5KPG5Zqgbt2cKdnEAqAeHzria_9BFIy_WzDS7OwEk_ENA-zPBae-zxd_uA45SJrRbJ2-zl1TsiL0elledTBTQ8AIeq9JfEN_cJ1_e6VtUedZZesohZZGqh81t1QYtxEbrNRaNowNkIxfk0HjpQlKX93IBJ2NkeBYWNNvS40gcHwrTkP1JvAzFmV23vDo4AtGEAbynn2Lhq0e6Hvh23N9LHd0pyypWB251e-HNqI_Gnt0_u60iDhoL2vRmDX9PvU_KNguRLanekaAYRoegBTQ6T9znMYLvO_S40GsBe03p2fXsPqcu-4dzbN6BuHzlNHwAHu2CGCNWTqVwMeFOtm99R_wsznuPPre76AODjyQHk2RCN5eAXCHPzN2B1tCnwAFExzCr6JWhEvsuhE-O0JPHTxq0fJVcbgMacZcyGEbvIbBvgACIwWosD59ZpYJ1klTZmMtQhXqCICIDRRj0Lm96yU_nmVZZOKcuxt5e92UYV15LWHhROJRJIjFG6Yu9OEdiToF6-myemcmM",
        },
      },
    });

    setEcho(echoInstance);

    return () => {
      echoInstance.disconnect();
    };
  }, [token]);

  return (
    <EchoContext.Provider value={{ echo, setToken }}>
      {children}
    </EchoContext.Provider>
  );
};

export const useEcho = (): EchoContextType => {
  const context = useContext(EchoContext);
  if (!context) {
    throw new Error("useEcho deve ser usado dentro de um EchoProvider");
  }
  return context;
};
