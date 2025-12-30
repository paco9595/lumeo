// Types for our data
export interface ProfileData {
    first_name: string;
    last_name: string;
    email: string;
    role?: string;
    image_url?: string;
    bio?: string; // Add placeholder bio
    phone?: string; // Add placeholder phone
}

export interface AddressData {
    id?: number;
    country: string;
    city: string;
    state?: string;
    postal_code: string;
    line1?: string;
}