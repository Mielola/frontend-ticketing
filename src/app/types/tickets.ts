
export interface Ticket {
    category: number;
    category_resolved_id: number;
    created_at: string;
    detail_kendala: string;
    due_date: string | null;
    hari_masuk: string;
    hari_respon: string;
    id: number;
    last_replier: {
        email: string,
        name: string,
        avatar: string
    },
    note_resolved: string
    owner: string;
    priority: "low" | "medium" | "high";
    products_name: string;
    respon_diberikan: string;
    status: "New" | "In Progress" | "Resolved" | "Closed";
    subject: string;
    time_worked: string | null;
    tracking_id: string;
    updated_at: string;
    user_email: string;
    user_name: string;
    user: {
        email: string,
        name: string,
        avatar: string
    },
    waktu_masuk: string;
    waktu_respon: string;
}