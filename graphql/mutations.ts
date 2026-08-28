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

// 게시글에 좋아요를 누르는 요청.
// resetUserPassword처럼 결과로 객체가 아니라 숫자(좋아요를 누른 뒤의 최신 좋아요 개수) 하나만 오기 때문에
// 뒤에 { } 로 항목을 고를 필요가 없음
export const LIKE_BOARD = gql`
  mutation likeBoard($boardId: ID!) {
    likeBoard(boardId: $boardId)
  }
`;

// 게시글에 싫어요를 누르는 요청. 구조는 LIKE_BOARD와 완전히 동일
export const DISLIKE_BOARD = gql`
  mutation dislikeBoard($boardId: ID!) {
    dislikeBoard(boardId: $boardId)
  }
`;

export const CREATE_BOARD_COMMENT = gql`
  mutation createBoardComment(
    $boardId: ID!
    $createBoardCommentInput: CreateBoardCommentInput!
  ) {
    createBoardComment(
      boardId: $boardId
      createBoardCommentInput: $createBoardCommentInput
    ) {
      _id
      writer
      contents
      rating
      user {
        name
      }
      createdAt
    }
  }
`;
