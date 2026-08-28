// 댓글 목록 조회 + 댓글 작성 폼, 둘 다 이 컴포넌트 하나에서 처리함
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { FETCH_BOARD_COMMENTS } from "@/graphql/queries";
import { CREATE_BOARD_COMMENT } from "@/graphql/mutations";
import type { BoardComment } from "@/types/board-comment";
import styles from "./styles.module.css";

// 별점을 몇 개까지 보여줄지 (1~5점)
const RATING_MAX = 5;

type BoardCommentProps = {
  boardId: string;
};

export default function BoardComment({ boardId }: BoardCommentProps) {
  // 댓글 목록 조회
  const { data, loading, refetch } = useQuery<{
    fetchBoardComments: BoardComment[];
  }>(FETCH_BOARD_COMMENTS, {
    variables: { boardId },
    ssr: false,
  });

  // 댓글 작성 (훅은 항상 조건문/return보다 위에!)
  const [createBoardComment] = useMutation(CREATE_BOARD_COMMENT);

  // 폼에 입력하는 값들
  const [writer, setWriter] = useState("");
  const [password, setPassword] = useState("");
  const [contents, setContents] = useState("");
  const [rating, setRating] = useState(0);

  // data가 아직 없으면(로딩 중) 빈 배열로 대체
  const comments = data?.fetchBoardComments ?? [];

  const onChangeWriter = (event: ChangeEvent<HTMLInputElement>) => {
    setWriter(event.target.value);
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onChangeContents = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContents(event.target.value);
  };

  const onClickRating = (value: number) => {
    setRating(value);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contents) {
      alert("댓글 내용을 입력해 주세요.");
      return;
    }
    if (rating === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    try {
      await createBoardComment({
        variables: {
          boardId,
          createBoardCommentInput: {
            // 빈 문자열("")로 남겨뒀으면 아예 안 보낸 것처럼 undefined로 바꿔줌
            writer: writer || undefined,
            password: password || undefined,
            contents,
            rating,
          },
        },
      });

      // 성공하면 입력값 싹 비우고, 목록을 다시 불러와서 방금 쓴 댓글이 바로 보이게 함
      setWriter("");
      setPassword("");
      setContents("");
      setRating(0);
      refetch();
    } catch (error) {
      alert("댓글 등록에 실패했어요.");
      console.error(error);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>댓글 {comments.length}개</h2>

      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.writerRow}>
          <input
            className={styles.writerInput}
            placeholder="이름"
            value={writer}
            onChange={onChangeWriter}
          />
          <input
            className={styles.writerInput}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={onChangePassword}
          />
          <div className={styles.ratingStars}>
            {/* 1부터 RATING_MAX(5)까지 숫자 배열 [1,2,3,4,5]를 만들어서 별 5개를 반복해서 그림 */}
            {Array.from({ length: RATING_MAX }, (_, index) => index + 1).map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  className={styles.star}
                  onClick={() => onClickRating(value)}
                >
                  {/* 내가 고른 점수(rating)보다 작거나 같은 번호의 별은 채워진 별로 보여줌 */}
                  {value <= rating ? "★" : "☆"}
                </button>
              ),
            )}
          </div>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="댓글을 입력해 주세요."
          value={contents}
          onChange={onChangeContents}
        />

        <button type="submit" className={styles.submitButton}>
          댓글 등록
        </button>
      </form>

      {loading && <p className={styles.state}>댓글을 불러오고 있어요...</p>}

      <ul className={styles.list}>
        {comments.map((comment) => (
          <li key={comment._id} className={styles.item}>
            <div className={styles.itemHeader}>
              <strong>{comment.writer ?? comment.user?.name ?? "익명"}</strong>
              <span className={styles.itemRating}>
                {"★".repeat(comment.rating)}
              </span>
              <time>{comment.createdAt.slice(0, 10).replaceAll("-", ".")}</time>
            </div>
            <p className={styles.itemContents}>{comment.contents}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
