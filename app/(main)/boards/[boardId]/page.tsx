// 게시글 상세

// 게시글 상세

import BoardDetail from "@/components/boards/board-detail";
import HeroBanner from "@/components/home/hero-banner";

// [boardId] 폴더 이름 덕분에, /boards/abc123 으로 들어오면 boardId에 "abc123"이 담김
// 그런데 최신 Next.js에서는 이 값이 곧바로 쓸 수 있는 값이 아니라 "Promise"로 옴.
type BoardDetailPageProps = {
  params: Promise<{ boardId: string }>;
};

// 함수 앞에 async : "이 함수 안에서 await를 쓸 거예요" 라는 표시
// mutations 연결할 때 onSubmit 앞에 async를 붙였던 것과 똑같은 이유.
export default async function BoardDetailPage({
  params,
}: BoardDetailPageProps) {
  // await: "Promise(약속표)가 진짜 값으로 바뀔 때까지 여기서 기다렸다가" 꺼내옴
  // 결과로 { boardId: "abc123" } 같은 평범한 객체를 받게 됨
  const { boardId } = await params;

  return (
    <main>
      {/* 홈 화면에서 만든 큰 배너를, small 옵션으로 작게 줄여서 재사용 */}
      <HeroBanner small />

      {/* 방금 꺼낸 boardId를 그대로 넘겨줌.
          BoardDetail 컴포넌트가 이 값으로 "이 글 하나만 주세요"라고 서버에 물어볼 예정 */}
      <BoardDetail boardId={boardId} />
    </main>
  );
}
