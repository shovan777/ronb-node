import { Url } from 'url';

export interface News {
  id: number;
  name: string;
  title?: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
  content: string;
  images?: string[];
  category?: number;
  tags?: string[];
  link?: string;
  source?: string;
}
