import z from "zod";
export const taskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1),
    description: z
        .string()
        .trim()
        .optional(),
    status: z
        .enum(["pending", "in_progress", "completed", "cancelled"])
        .optional(),
    priority: z
        .int()
        .min(1)
        .max(100)
        .optional(),
    deadLineAt: z
        .date()
        .optional(),
    estimatedMinutes: z
        .number()
        .int()
        .positive()
        .optional()
});
