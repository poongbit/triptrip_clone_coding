// 데이터를 읽어오는 명령
// GraphQL이라는 별도의 "질문 언어가 등장"

// "지금부터 나오는 문자열은 평범한 글자가 아니라 GraphQL 질문문이야" 라고 표시해주는 특별한 함수
import { gql } from "@apollo/client";

// 백틱(`)으로 감싸주면, Apollo가 이 글자를 알아서 GraphQL 질문으로 해석해줌
// 이 서버에서 뭘 물어보고, 답에서 어떤 항목만 받을지를 정의함
// FETCH_BOARDS 등은 여러 화면에서도 반복적으로 쓰일 수 있기 때문에, 한 곳에 모아두고 import로 쓰면 편리함

// 1. 질문 시작
// query : 데이터만 읽기만 할 예정, 수정할 때는 mutation
// fetchBoards : 임의로 지은 이름, 보통 서버가 정해둔 API 이름과 맞춰줌
// ($page: Int, $search: String) : 이 질문이 받을 "입력값"

// 2. 데이터 목록 전체
// 실제로 서버에게 fetchBoards라는 데이터를 달라고 요청, page와 search는 전달값으로 이용.

export const FETCH_BOARDS = gql`
  query fetchBoards($page: Int, $search: String) {
    fetchBoards(page: $page, search: $search) {
      _id
      writer
      title
      contents
      likeCount
      images
      createdAt
    }
  }
`;

// 특정 게시글 하나만 달라고 질문
// ID! : ID는 반드시 필요하다!

export const FETCH_BOARD = gql`
  query fetchBoard($boardId: ID!) {
    fetchBoard(boardId: $boardId) {
      _id
      writer
      title
      contents
      likeCount
      dislikeCount
      images
      createdAt
    }
  }
`;

export const FETCH_USER_LOGGED_IN = gql`
  query fetchUserLoggedIn {
    fetchUserLoggedIn {
      _id
      email
      name
      picture
      userPoint {
        amount
      }
    }
  }
`;

// 댓글 요청

export const FETCH_BOARD_COMMENTS = gql`
  query fetchBoardComments($boardId: ID!) {
    fetchBoardComments(boardId: $boardId) {
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
