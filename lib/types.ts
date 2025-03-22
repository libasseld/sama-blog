export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  comments?: Comment[];
}

export interface CreatePostPayload {
  title: string;
  content: string;
  image?: File;
}

export interface Comment {
  id: number;
  name: string;
  comment: string;
  post_id: number;
  created_at: string;
}

export interface CreateCommentPayload {
  name: string;
  comment: string;
}