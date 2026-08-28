// userQuery로 서버에 데이터를 요청하니까, 클라이언트 컴포넌트여야 함

"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";

import { FETCH_BOARD } from "@/graphql/queries";
import type { Board } from "@/types/board";
import styles from "./styles.module.css";

// 게시글에 이미지가 하나도 없을 때 디신 보여줄 기본 이미지
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85";

// contents 안에 <p>, br 같은 HTML 태그가 글자로 들어올 수 있어서,
// 그 태그 부분만 걷어내고, 순수한 글자만 남기는 함수

const removeHTMLTags = (contents: string) => contents.replace(/<[^>]+>/g, "");

// image 배열 중에서 실제로 쓸 수 있는 첫 번째 이미지 주소를 골라내는 함수
const getImageUrl = (images?: string[] | null) => {
  // .find() : 배열을 돌면서, 조건에 맞는 "첫번 째 요소 하나"를 찾아와줌 (.map처럼 전부 돌지 않고, 찾으면 바로 종료)
  const firstImage = images?.find((image) => image !== "");

  if (!firstImage) return FALLBACK_IMAGE;

  // 이미 http로 시작하는 완성된 주소면 그대로 사용
  if (firstImage.startsWith("http")) return firstImage;

  // 파일 이름만 왔다면, 서버가 파일을 보관하는 저장소 주소를 앞에 붙여서 완성시킴
  return `https://storage.googleapis.com/${firstImage}`;
};

type BoardDetailProps = {
  boardId: string;
};

export default function BoardDetail({ boardId }: BoardDetailProps) {
  // page.tsx에서 넘겨받은 boardId를 변수로 실어 보내서, "이 글 하나만 주세요" 라고 요청
  const { data, loading, error } = useQuery<{ fetchBoard: Board }>(
    FETCH_BOARD,
    {
      variables: { boardId },
      ssr: false,
    },
  );

  if (loading)
    return <p className={styles.state}>게시글을 불러오고 있어요...</p>;
  if (error || !data)
    return <p className={styles.state}>게시글을 불러오지 못했어요.</p>;

  const board = data.fetchBoard;

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{board.title}</h1>

      <div className={styles.information}>
        <div className={styles.writer}>
          <span className={styles.avatar} aria-hidden="true" />
          <strong>{board.writer ?? "익명"}</strong>

          {/* created AI은 앞글자 연-월-일만 잘라내고, "-"는 "."으로 바꿔줌 */}

          <time>{board.createdAt.slice(0, 10).replaceAll("-", ".")}</time>
        </div>
        <span className={styles.like}>♡ {board.likeCount}</span>
      </div>
      <img
        src={getImageUrl(board.images)}
        className={styles.mainImage}
        alt="게시글 대표 이미지"
      />

      <p className={styles.contents}>{removeHTMLTags(board.contents)}</p>

      <div className={styles.actions}>
        {/* 아직 클릭해도 아무 일 안 일어남 - 2단계에서 진짜 좋아요 뮤테이션을 연결할 예정 */}

        <button type="button" className={styles.likeButton}>
          ♡ 좋아요
        </button>
        <Link href="/" className={styles.listLink}>
          목록으로
        </Link>
      </div>
    </article>
  );
}
