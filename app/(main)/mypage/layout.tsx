import type { ReactNode } from "react";

// 폴더 안 index.tsx를 자동으로 찾아서 가져와줌 (Header를 불러올 때랑 같은 방식)
import UserInfo from "@/components/mypage/user-info";
import styles from "./styles.module.css";

type MyPageLayoutProps = {
  children: ReactNode;
};

// 이 레이아웃은 app/(main)/mypage 폴더 밑에 있는 모든 페이지(비밀번호 변경, 거래내역 등)에
// 공통으로 적용돼. Header가 이미 app/(main)/layout.tsx에서 한 번 그려지고 있으니까,
// 여기서는 Header를 또 넣지 않고, "마이 페이지 제목 + 내 정보 카드"만 공통으로 추가하는 거야.
export default function MyPageLayout({ children }: MyPageLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>마이 페이지</p>

      <div className={styles.content}>
        {/* 카드(내 정보 + 메뉴 3개)는 모든 마이페이지 화면에서 똑같이 보여야 하니까 여기 고정 */}
        <UserInfo />

        {/* children 자리에는 지금 주소에 맞는 실제 화면이 들어옴.
            /mypage/password로 들어왔으면 비밀번호 변경 폼이,
            나중에 /mypage/points로 들어오면 포인트 내역 화면이 여기 꽂힘 */}
        {children}
      </div>
    </div>
  );
}
