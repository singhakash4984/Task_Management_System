export type taskInput = {
    userId: string ;
    title:string;
    description?: string ;
    status?: "pending" | "in_progress" | "completed" | "cancelled";
    priority?:number;
    deadlineAt?: Date | null ;
    estimatedMinutes?: number | null ;
} ;