export interface Story {
  storyId: string;
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  images: ImageWithStory[];
  expiresAt: string;
  createdAt: Date | string;
}

export interface ImageWithStory {
  url: string;
  seen: boolean;
  fullySeen: boolean;
  storyId: string;
  description?: string;
  isGlobal?: string;
  createdAt?: Date | string;
}
