/**
 * Authorization options interface
 * Used to configure role-based and user-based authorization
 */
export interface AuthorizationOptions {
    /**
     * Array of roles that are allowed to access the resource
     */
    hasRole: Array<"admin" | "organizer" | "user">;
    
    /**
     * Whether to allow users to access their own resources
     * When true, users can access resources where the ID matches their UID
     */
    allowSameUser?: boolean;
}
