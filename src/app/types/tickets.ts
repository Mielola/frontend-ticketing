
export interface Ticket {
    category: number;
    created_at: string;
    detail_kendala: string;
    due_date: string | null;
    hari_masuk: string;
    hari_respon: string;
    id: number;
    owner: string;
    priority: "low" | "medium" | "high";
    respon_diberikan: string;
    status: "New" | "In Progress" | "Resolved" | "Closed";
    subject: string;
    time_worked: string | null;
    tracking_id: string;
    updated_at: string;
    user_email: string;
    user_name: string;
    waktu_masuk: string;
    waktu_respon: string;
}