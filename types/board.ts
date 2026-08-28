// 게시글 데이터가 어떤 모양인지 정하는 설계도
// 서버에 기시글을 받아올 때마다 이 모양을 따라야 함

export type Board = {
  // 게시글마다 고유하기 붙는 id
  _id: string;
  writer?: string | null;
  title: string;
  contents: string;
  likeCount: number;
  dislikeCount: number;
  images?: string[] | null;
  createdAt: string;
};
