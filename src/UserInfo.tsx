
export type UserInfo = {
    id : string;
    username : string;
}

export interface ContextProps {
    readonly userInfo: UserInfo | null;
    readonly setUserInfo: (userInfo: UserInfo | null) => void;

}
