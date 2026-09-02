// 데이터를 만들거나 로그인하는 명령

import { gql } from "@apollo/client";

// 회원가입 뮤테이션
// - CreateUserInput은 email/name/password를 하나의 객체로 묶어서 보내는 타입
// - 강사님 예제(같은 실습용 API를 쓰는 참고 프로젝트)에서 검증된 패턴을 그대로 사용함
export const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      _id
      email
      name
    }
  }
`;

// 로그인 뮤테이션
// - 성공하면 accessToken 딱 하나만 돌아옴. 이 토큰을 localStorage에 저장해두면
//   apollo-setting.tsx의 authLink가 앞으로의 모든 요청에 자동으로 Bearer 토큰을 실어서 보내줌
export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`;

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

// 게시글 수정. title/contents 등은 다 선택값이라, 바꾸고 싶은 것만 골라서 보내면 됨
export const UPDATE_BOARD = gql`
  mutation updateBoard($boardId: ID!, $updateBoardInput: UpdateBoardInput!) {
    updateBoard(boardId: $boardId, updateBoardInput: $updateBoardInput) {
      _id
      title
      contents
    }
  }
`;

// 게시글 삭제. boardId만 있으면 됨 (password 파라미터는 없다는 걸 Sandbox에서 확인했음 —
// 즉 로그인한 본인인지는 서버가 로그인 토큰만으로 판단함)
export const DELETE_BOARD = gql`
  mutation deleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;

// 댓글 수정 뮤테이션
// - boardCommentId: 수정할 댓글의 고유 ID
// - password: 비회원 작성 시 입력했던 비밀번호
// - updateBoardCommentInput: 실제로 바뀔 내용.
export const UPDATE_BOARD_COMMENT = gql`
  mutation updateBoardComment(
    $boardCommentId: ID!
    $password: String
    $updateBoardCommentInput: UpdateBoardCommentInput!
  ) {
    updateBoardComment(
      boardCommentId: $boardCommentId
      password: $password
      updateBoardCommentInput: $updateBoardCommentInput
    ) {
      _id
      contents
      rating
    }
  }
`;

// 댓글 삭제 뮤테이션
// - boardCommentId: 삭제할 댓글의 고유 ID (필수)
// - password: 비회원 작성 시 입력했던 비밀번호 (선택 인자, 하지만 실제로 값이 틀리면
//   서버가 내부적으로 거부할 가능성이 높으니 프론트에서도 반드시 입력받아서 보낼 것)
export const DELETE_BOARD_COMMENT = gql`
  mutation deleteBoardComment($boardCommentId: ID!, $password: String) {
    deleteBoardComment(boardCommentId: $boardCommentId, password: $password)
  }
`;
