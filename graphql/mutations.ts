// 데이터를 만들거나 로그인하는 명령

// 데이터를 만들거나 로그인하는 명령
import { gql } from "@apollo/client";

// 새 비밀번호로 바꿔달라는 요청.
// "누구의 비밀번호냐"를 따로 안 넘기는 이유: 로그인 토큰(Authorization 헤더)으로
// 서버가 이미 "지금 요청한 사람이 누구인지" 알고 있기 때문
export const RESET_USER_PASSWORD = gql`
  mutation resetUserPassword($password: String!) {
    resetUserPassword(password: $password)
  }
`;
