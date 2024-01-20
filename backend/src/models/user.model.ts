import { z } from "zod";

interface UserModel {
    id: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = z.object({
    username: z.string()
        .regex(/^[a-zA-Z0-9]+$/, { message: "username must be alphanumeric" })
        .min(3, { message: "username must be at least 3 characters long" })
        .max(50, { message: "username cannot be longer than 50 characters" }),
    password: z.string()
        .min(8, { message: "password must be at least 8 characters long"}),
});

export type User = UserModel;
export { UserSchema };
