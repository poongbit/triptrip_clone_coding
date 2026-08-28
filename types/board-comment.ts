// 댓글 데이터가 어떤 모양인지 정하는 설계도
// graphql/queries.ts의 FETCH_BOARD_COMMENTS가 서버에서 받아오는 값과 모양이 똑같아야 함

export type BoardComment = {
  _id: string;

  // 비회원이 이름만 입력하고 쓴 댓글이면 여기 값이 들어있음
  writer?: string | null;

  contents: string;

  // 별점. Float(소수점 있는 숫자)로 왔지만, 우리는 1~5 사이의 정수로만 쓸 예정
  rating: number;

  // 로그인한 회원이 쓴 댓글이면, writer 대신 여기에 회원 정보가 들어있음
  user?: {
    name: string;
  } | null;

  createdAt: string;
};
