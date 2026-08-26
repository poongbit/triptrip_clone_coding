// 메인 화면

import BoardSection from "@/components/home/board-section";
import HeroBanner from "@/components/home/hero-banner";

export default function Homepage() {
  // "최종적으로 화면에 보여질 실제 내용물"이라서 전달 받을 값이 따로 없음

  return (
    <main>
      {/* 페이지는 큰 화면 족가을 순서대로 조립함. */}
      <HeroBanner />
      {/* 위쪽 배너 영역을 그리는 컴포넌트 (이제 만들어야 함) */}
      <BoardSection />
      {/* 게시글 목록을 그리는 컴포넌트 (아직 안 만듬) */}
    </main>
  );
}
