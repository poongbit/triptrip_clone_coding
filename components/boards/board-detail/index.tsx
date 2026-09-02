// userQuery로 서버에 데이터를 요청하니까, 클라이언트 컴포넌트여야 함

"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FETCH_BOARD } from "@/graphql/queries";
import type { Board } from "@/types/board";
import {
  LIKE_BOARD,
  DISLIKE_BOARD,
  UPDATE_BOARD,
  DELETE_BOARD,
} from "@/graphql/mutations";
import BoardComment from "@/components/boards/board-comment";
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
  const { data, loading, error, refetch } = useQuery<{ fetchBoard: Board }>(
    FETCH_BOARD,
    {
      variables: { boardId },
      ssr: false,
    },
  );

  // 삭제 성공 후 홈으로 이동시키기 위해 필요함 (onClickDelete에서 사용)
  const router = useRouter();

  const [likeBoard] = useMutation(LIKE_BOARD);
  const [dislikeBoard] = useMutation(DISLIKE_BOARD);
  const [updateBoard] = useMutation(UPDATE_BOARD);
  const [deleteBoard] = useMutation(DELETE_BOARD);

  // 지금 "보기 모드"인지 "수정 모드"인지 기억하는 값
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContents, setEditContents] = useState("");

  if (loading)
    return <p className={styles.state}>게시글을 불러오고 있어요...</p>;
  if (error || !data)
    return <p className={styles.state}>게시글을 불러오지 못했어요.</p>;

  const board = data.fetchBoard;

  const onClickEdit = () => {
    // 수정 모드에 들어갈 때, 인풋 초기값을 지금 게시글 내용으로 미리 채워둠
    setEditTitle(board.title);
    setEditContents(board.contents);
    setIsEditing(true);
  };

  const onClickCancelEdit = () => {
    setIsEditing(false);
  };

  const onChangeEditTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const onChangeEditContents = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditContents(event.target.value);
  };

  const onSubmitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateBoard({
        variables: {
          boardId,
          updateBoardInput: {
            title: editTitle,
            contents: editContents,
          },
        },
      });

      setIsEditing(false);
      refetch();
    } catch (mutationError) {
      alert("게시글 수정에 실패했어요. 로그인 상태를 확인해 주세요.");
      console.error(mutationError);
    }
  };

  const onClickDelete = async () => {
    // confirm(): 브라우저가 기본으로 제공하는 "확인/취소" 팝업.
    // 사용자가 "확인"을 누르면 true, "취소"를 누르면 false를 돌려줌
    const isConfirmed = confirm("정말 이 게시글을 삭제하시겠어요?");
    if (!isConfirmed) return;

    try {
      await deleteBoard({ variables: { boardId } });
      alert("게시글이 삭제되었어요.");
      // 삭제됐으니 상세 페이지에 더 있을 이유가 없어서, 홈("/")으로 이동시킴
      router.push("/");
    } catch (mutationError) {
      alert("게시글 삭제에 실패했어요. 로그인 상태를 확인해 주세요.");
      console.error(mutationError);
    }
  };

  const onClickLike = async () => {
    try {
      await likeBoard({ variables: { boardId } });
      // 좋아요 요청이 성공하며, 게시글 정보를 서버에서 다시 불러와서
      // 화면의 좋아요 개수를 최신 값으로 갱신함 (board-section 검색할 때 썼던 refetch랑 같은 것)
      refetch();
    } catch (mutationError) {
      alert("좋아요 처리에 실패했어요. 로그인 상태를 확인해주세요.");
      console.error(mutationError);
    }
  };

  const onClickDislike = async () => {
    try {
      await dislikeBoard({ variables: { boardId } });
      refetch();
    } catch (mutationError) {
      alert("싫어요 처리에 실패했어요. 로그인 상태를 확인해주세요.");
      console.error(mutationError);
    }
  };

  return (
    <article className={styles.article}>
      {isEditing ? (
        <form className={styles.editForm} onSubmit={onSubmitEdit}>
          <input
            className={styles.editTitleInput}
            value={editTitle}
            onChange={onChangeEditTitle}
          />
          <textarea
            className={styles.editContentsInput}
            value={editContents}
            onChange={onChangeEditContents}
          />
          <div className={styles.editActions}>
            <button type="submit" className={styles.saveButton}>
              저장
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClickCancelEdit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className={styles.title}>{board.title}</h1>

          <div className={styles.information}>
            <div className={styles.writer}>
              <span className={styles.avatar} aria-hidden="true" />
              <strong>{board.writer ?? "익명"}</strong>
              <time>{board.createdAt.slice(0, 10).replaceAll("-", ".")}</time>
            </div>
            <div className={styles.reactions}>
              <span className={styles.like}>♡ {board.likeCount}</span>
              <span className={styles.dislike}>✕ {board.dislikeCount}</span>
            </div>
          </div>

          <img
            src={getImageUrl(board.images)}
            className={styles.mainImage}
            alt="게시글 대표 이미지"
          />

          <p className={styles.contents}>{removeHTMLTags(board.contents)}</p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.likeButton}
              onClick={onClickLike}
            >
              ♡ 좋아요
            </button>
            <button
              type="button"
              className={styles.dislikeButton}
              onClick={onClickDislike}
            >
              ✕ 싫어요
            </button>
            <button
              type="button"
              className={styles.editButton}
              onClick={onClickEdit}
            >
              수정
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={onClickDelete}
            >
              삭제
            </button>
            <Link href="/" className={styles.listLink}>
              목록으로
            </Link>
          </div>
        </>
      )}

      <BoardComment boardId={boardId} />
    </article>
  );
}
