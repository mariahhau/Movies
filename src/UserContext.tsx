import { createContext, useState } from "react";
import { UserInfo, ContextProps } from "./UserInfo";

export const UserContext = createContext<ContextProps>({
    userInfo: null,
    setUserInfo: () => null
});


export function UserContextProvider({ children }: any) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}
