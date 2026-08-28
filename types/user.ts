// 회원(로그인한 사용자) 데이터가 어떤 모양인지 정하는 설계도
// graphql/queries.ts의 FETCH_USER_LOGGED_IN이 서버에서 받아오는 값과 모양이 똑같아야 함
// (서버가 주는 항목과 타입이 다르면, 그 항목을 쓰는 곳에서 타입 에러가 남)

export type User = {
  // 회원마다 고유하게 붙는 id
  _id: string;

  email: string;

  // 화면에 보여줄 이름 (마이페이지 "내 정보" 카드의 "김상훈" 같은 값)
  name: string;

  // 프로필 사진 주소. 프로필 사진을 등록 안 한 회원도 있을 수 있어서
  // board.ts의 writer/images처럼 "없을 수도 있다(optional + null)"로 표시
  picture?: string | null;

  // 포인트는 숫자 하나가 아니라, { amount: 숫자 } 형태의 "객체"로 옴
  // 마이페이지 카드의 "23,000 P" 부분이 여기서 나옴
  userPoint: {
    amount: number;
  };
};
