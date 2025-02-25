export interface UserLogs {
    id: number;
    email: string;
    name: string;
    role: string;
    shift_name: string | null;
    avatar: string;
    status: string;
    login_date: string;
    login_time: string;
}