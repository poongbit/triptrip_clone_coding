// 브라우저에서 동작하는 기능을 쓰기 위해 필요
"use client";

import { useQuery } from "@apollo/client/react";

// Next.js가 제공하는 특별한 <a> 태그. 페이지 전체를 새로고침 안 하고 화면만 부드럽게 바꿔줌
import Link from "next/link";
import { useState } from "react";

// 폼이 제출되는 순간 발생하는 이벤트 타입
import type { FormEvent } from "react";

import { FETCH_BOARDS } from "@/graphql/queries";
import type { Board } from "@/types/board";
import styles from "./styles.module.css";

// 카드 4개에 쓸 이미지 주소를 미리 배열로 준비
const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=640&q=80",
];

const formatDate = (date: string) => date.slice(0, 10).replaceAll("-", ".");

export default function BoardSection() {
  // useState : 이 컴포넌트가 기억해야 할 값(상태)를 만드는 도구
  // const [값, 값을바꾸는함수] = useState(초기값) 형태로 짝지어 씀
  // keyword : 지금 검색창에서 입력된 글자를 저장하는 값 (처음은 빈 문자열)
  // setKeyword: keyword 값을 바꾸고 싶을 때 반드시 이 함수를 통해서 바꿔야 함.

  const [keyword, setKeyword] = useState("");

  // userQuery : GraphQL 질문을 실제로 서버에 보내는 함수

  // "서버에 돌려줄 데이터는 fetchBoards라는 이름의 Board 배열이다." 라고 미리 타입을 알려줌
  const { data, loading, error, refetch } = useQuery<{ fetchBoards: Board[] }>(
    FETCH_BOARDS,
    {
      // 첫번쨰 인자 : "무슨 질문", 두번째 인자 :" 그 질문에 필요한 값"
      // 반횐된 객체에서 4개를 바로 꺼내 씀
      // data : 서버가 준 실제 데이터 (안 왔으면 undefined)
      // loading : 지금 요청 중인지 (true/false)
      // error : 요청이 실패했는 지
      // refetch : "같은 질문을 다른 조건으로 다시 보내줘" 라는 함수 (검색할 때 씀)
      variables: { page: 1, search: "" },
      ssr: false,
    },
  );

  // data가 아직 없으면(undefined) 옵셔널 체이닝(?.) 덕에 에러가 안나고 undefined가 됨
  // ??을 통해, 그마저도 없으면 빈 배열 [] 로 번환하라
  const boards = data?.fetchBoards ?? [];

  // 0번째부터 4번째 직전까지 잘라온다.
  const hotBoards = boards.slice(0, 4);

  // 앞의 10개만 잘라와서 게시판 표에 보여줌.
  const displayedBoards = boards.slice(0, 10);

  const onSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
    // 폼을 제출하면, 브라우저가 원래 하려는 "페이지 새로고침" 동작을 막는 필수 코드
    event.preventDefault();
    // 지금 입력된 keyword로 검색 조건을 바꿔서 다시 질문을 보냄.
    refetch({ page: 1, search: keyword });
  };

  // 조기 리턴 패턴, 로딩 중이면 그 즉시 함수를 끝내고, 로딩 메시지만 화면에 불러옴
  if (loading)
    return <p className={styles.state}>게시글을 불러오고 있어요...</p>;
  if (error) return <p className={styles.state}>API 연결을 확인해주세요.</p>;

  // 데이터가 왔을 때만 아래쪽 진짜 화면 코드까지 도달함

  return (
    <section className={styles.section}>
      <div className={styles.hotSection}>
        <h2>오늘 핫한 트립토크</h2>

        <div className={styles.cardList}>
          {hotBoards.map((board, index) => (
            <Link
              className={styles.card}
              href={`/boards/${board._id}`}
              key={board._id}
            >
              {/* .map()으로 배열의 각 게시글마다 카드 하나씩 반복해서 그림
                        key={board._id} : React가 "이 카드들 중 뭐가 뭔지" 구별하려고 꼭 필요한 값. 고유한 값이여야 해서 보통 _id를 쓴다. 
                        href={`/boards/${board._id}} : 이 카드를 누르면 그 게시글 상세 주소로 이동. */}

              <img
                className={styles.cardImage}
                src={CARD_IMAGES[index]}
                alt=""
              />

              <div className={styles.cardContent}>
                <h3>{board.title}</h3>

                <p className={styles.writer}>
                  <span className={styles.avatar}>👤</span>
                  {/* writer가 없으면 익명으로 남김 */}
                  {board.writer ?? "익명"}
                </p>

                <div className={styles.cardBottom}>
                  <span>♡ {board.likeCount}</span>
                  <time>{formatDate(board.createdAt)}</time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.boardArea}>
        <h2>트립토크 게시판</h2>

        <div className={styles.tools}>
          <form className={styles.search} onSubmit={onSubmitSearch}>
            <div className={styles.dateBox}>
              ▣&nbsp;&nbsp; YYYY. MM. DD - YYYY. MM. DD
            </div>

            <label className={styles.searchBox}>
              <span>⌕</span>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="제목을 입력해주세요."
              />
            </label>

            <button className={styles.searchButton} type="submit">
              검색
            </button>
          </form>

          <Link className={styles.writeButton} href="/boards/new">
            ▣&nbsp; 트립토크 등록
          </Link>
        </div>

        <div className={styles.tableBox}>
          <div className={`${styles.row} ${styles.head}`}>
            <span className={styles.number}>번호</span>
            <span className={styles.titleCell}>제목</span>
            <span className={styles.writerCell}>작성자</span>
            <span className={styles.dateCell}>날짜</span>
          </div>

          {displayedBoards.map((board, index) => (
            <div className={styles.row} key={board._id}>
              <span className={styles.number}>{243 - index}</span>
              <Link className={styles.titleCell} href={`/boards/${board._id}`}>
                {board.title}
              </Link>
              <span className={styles.writerCell}>
                {board.writer ?? "익명"}
              </span>
              <time className={styles.dateCell}>
                {formatDate(board.createdAt)}
              </time>
            </div>
          ))}

          <div className={styles.pagination}>
            <button type="button">‹</button>
            <button className={styles.selected} type="button">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">4</button>
            <button type="button">5</button>
            <button type="button">›</button>
          </div>
        </div>
      </div>
    </section>
  );
}
