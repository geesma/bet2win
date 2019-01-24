export interface News {
  title: string;
  text: string;
  imageUrl: string;
  date: Date;
  author: Author;
  preview: {
    thumbnailUrl?: string;
    title: string;
    text?: string;
    author: Author;
    comentsNum: number;
    previewStyle: string;
  };
  coments?: {
    coment: string;
    dateTime: Date;
    author: Author;
  }[];
}

export interface Author {
  uid: string;
  name: string;
  role: string;
  imageUrl?: string;
}
