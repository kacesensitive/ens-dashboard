export interface Version {
  Major: number;
  Minor: number;
  Patch: number;
}

export interface FileInfo {
  Version: Version;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Streamer {
  name: string;
  id: number;
}

export interface Emoticon {
  _id: string;
  begin: number;
  end: number;
}

export interface Commenter {
  display_name: string;
  _id: string;
  name: string;
  bio: string;
  created_at: string;
  updated_at: string;
  logo: string;
}

export interface Fragment {
  text: string;
  emoticon: Emoticon | null;
}

export interface UserBadge {
  _id: string;
  version: string;
}

export interface Message {
  body: string;
  bits_spent: number;
  fragments: Fragment[];
  user_badges: UserBadge[];
  user_color: string;
  emoticons: Emoticon[];
}

export interface Comment {
  _id: string;
  created_at: string;
  channel_id: string;
  content_type: string;
  content_id: string;
  content_offset_seconds: number;
  commenter: Commenter;
  message: Message;
}

export interface Video {
  title: string;
  id: string;
  created_at: string;
  start: number;
  end: number;
  length: number;
  chapters: any[];
}

export interface Data {
  FileInfo: FileInfo;
  streamer: Streamer;
  video: Video;
  comments: Comment[];
}
