export interface UserTypes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilesUploaded{
  profileImage: string;
  coverImage: string;
}
