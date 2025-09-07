export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roles?: string[];
  profileImage?: File;
}

export interface Teacher {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImageUrl?: string;
  };
  yearOfExperience: number;
  degreeName: string;
  photoUrl?: string;
  skills: string[];
  salary: number;
  coursesEnrolled: any[];
  createdAt: string;
  updatedAt: string;
}

export interface TeachersResponse {
  success: boolean;
  message: string;
  data: Teacher[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  handleUnauthorized: () => void;
  isAuthenticated: boolean;
}
