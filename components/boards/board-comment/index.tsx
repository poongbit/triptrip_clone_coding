// 댓글 목록 조회 + 댓글 작성 폼 + 댓글별 수정/삭제, 전부 이 컴포넌트 하나에서 처리함
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { FETCH_BOARD_COMMENTS } from "@/graphql/queries";
import {
  CREATE_BOARD_COMMENT,
  UPDATE_BOARD_COMMENT, //
  DELETE_BOARD_COMMENT, //
} from "@/graphql/mutations";
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

  // 댓글 작성 / 수정 / 삭제
  const [createBoardComment] = useMutation(CREATE_BOARD_COMMENT);
  const [updateBoardComment] = useMutation(UPDATE_BOARD_COMMENT); // ▼ 새로 추가
  const [deleteBoardComment] = useMutation(DELETE_BOARD_COMMENT); // ▼ 새로 추가

  // 작성 폼에 입력하는 값들
  const [writer, setWriter] = useState("");
  const [password, setPassword] = useState("");
  const [contents, setContents] = useState("");
  const [rating, setRating] = useState(0);

  // ▼ 새로 추가: 지금 "수정 모드"인 댓글의 _id (수정 중이 아니면 null)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContents, setEditContents] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editPassword, setEditPassword] = useState("");

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

  // "수정" 버튼 클릭 -> 그 댓글을 수정 모드로 바꾸고, 기존 값으로 폼을 채워둠
  const onClickEdit = (comment: BoardComment) => {
    setEditingCommentId(comment._id);
    setEditContents(comment.contents);
    setEditRating(comment.rating);
    setEditPassword(""); // 비밀번호는 화면에 남겨두지 않고 매번 새로 입력받음
  };

  // "취소" 버튼 -> 수정 모드 해제
  const onClickCancelEdit = () => {
    setEditingCommentId(null);
  };

  const onChangeEditContents = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditContents(event.target.value);
  };

  const onClickEditRating = (value: number) => {
    setEditRating(value);
  };

  const onChangeEditPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setEditPassword(event.target.value);
  };

  // "수정 하기" 버튼 -> updateBoardComment 뮤테이션 실행
  // UpdateBoardCommentInput에는 writer가 없어서(Sandbox로 확인함), 작성자 이름은 수정 대상이 아님
  const onSubmitEdit = async (commentId: string) => {
    if (!editContents) {
      alert("댓글 내용을 입력해 주세요.");
      return;
    }
    if (editRating === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    try {
      await updateBoardComment({
        variables: {
          boardCommentId: commentId,
          password: editPassword || undefined,
          updateBoardCommentInput: {
            contents: editContents,
            rating: editRating,
          },
        },
      });

      setEditingCommentId(null);
      refetch();
    } catch (error) {
      alert("댓글 수정에 실패했어요. 비밀번호를 확인해 주세요.");
      console.error(error);
    }
  };

  // "삭제" 버튼 -> 비밀번호를 prompt로 받아서 deleteBoardComment 실행
  const onClickDelete = async (commentId: string) => {
    const inputPassword = window.prompt(
      "댓글 삭제 시 입력했던 비밀번호를 입력해 주세요.",
    );

    // prompt 창에서 "취소"를 누르면 null이 돌아옴 -> 그때는 아무것도 하지 않음
    if (inputPassword === null) {
      return;
    }

    try {
      await deleteBoardComment({
        variables: {
          boardCommentId: commentId,
          password: inputPassword || undefined,
        },
      });
      refetch();
    } catch (error) {
      alert("댓글 삭제에 실패했어요. 비밀번호를 확인해 주세요.");
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
            {Array.from({ length: RATING_MAX }, (_, index) => index + 1).map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  className={styles.star}
                  onClick={() => onClickRating(value)}
                >
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
        {comments.map((comment) =>
          comment._id === editingCommentId ? (
            // 지금 수정 중인 댓글이면, 목록 대신 수정 폼을 보여줌
            <li key={comment._id} className={styles.item}>
              <div className={styles.editForm}>
                <div className={styles.writerRow}>
                  <strong>
                    {comment.writer ?? comment.user?.name ?? "익명"}
                  </strong>
                  <div className={styles.ratingStars}>
                    {Array.from(
                      { length: RATING_MAX },
                      (_, index) => index + 1,
                    ).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={styles.star}
                        onClick={() => onClickEditRating(value)}
                      >
                        {value <= editRating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  className={styles.writerInput}
                  type="password"
                  placeholder="비밀번호 확인"
                  value={editPassword}
                  onChange={onChangeEditPassword}
                />

                <textarea
                  className={styles.textarea}
                  value={editContents}
                  onChange={onChangeEditContents}
                />

                <div className={styles.editActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onClickCancelEdit}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={() => onSubmitEdit(comment._id)}
                  >
                    수정 하기
                  </button>
                </div>
              </div>
            </li>
          ) : (
            // 평소 모드: 읽기 전용 표시 + 수정/삭제 버튼
            <li key={comment._id} className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>
                  {comment.writer ?? comment.user?.name ?? "익명"}
                </strong>
                <span className={styles.itemRating}>
                  {"★".repeat(comment.rating)}
                </span>
                <time>
                  {comment.createdAt.slice(0, 10).replaceAll("-", ".")}
                </time>
              </div>
              <p className={styles.itemContents}>{comment.contents}</p>
              <div className={styles.itemActions}>
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => onClickEdit(comment)}
                >
                  수정
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => onClickDelete(comment._id)}
                >
                  삭제
                </button>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
