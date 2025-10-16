import {z} from "zod";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query/react";

export type ExtendedFetchBaseQueryError = FetchBaseQueryError & {
    originalStatus?: number;
};

export interface AuthResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        profilePicture: string;
        roles: string[];
    }
}

export interface User {
    Id: number,
    Username: string,
    Password: string | null,
    ProfilePicture: string,
    Roles: string[],
}

export interface Login {
    Username: string;
    Password: string;
}

export interface Role {
    Id: number,
    Name: string,
    Description: string,
}

export interface Employee {
    Id: number;
    Firstname: string;
    Lastname: string;
    Phone?: string | null;
    Email: string;
    HireDate?: Date | null;
    IsCheckIn: number;
    DepartmentId: number;
    Department: string,
    PositionsId: number,
    Position: string
}

export interface Keycard {
    KeycardId: number,
    RfidTag: string,
    EmployeeId: number,
    IssueDate: string,
    ExpireDate: string,
    StatusTypesId: number,
    AccessLevels: string[]
}

export interface KeycardTier {
    Id: number,
    Name: string,
    Description: string,
}

export interface Package {
    Id: number,
    Customer: string,
    Token: string | null,
    IsSent: number,
    PackedAt: Date,
    ShippedAt: Date | null,
    Products: string[],
}

export const productSchema = z.object({
    Id: z.number(),
    Name: z.string().min(1, "Name is required"),
    Description: z.string().min(1, "Description is required"),
    Price: z.number().nonnegative("Price must be non-negative"),
    Image: z.string().min(1, "Image is required"),
    Active: z.number().int(),
    CreatedAt: z.date(),
    UpdatedAt: z.date(),
    Categories: z.array(z.string()),
    Quantity: z.number().int().nonnegative(),
});

export type Product = z.infer<typeof productSchema>;
