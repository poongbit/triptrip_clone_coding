// 이 컴포넌트도 헤더처럼 "지금 내가 마이페이지 안의 어느 화면에 있는지"를 알아야
// 메뉴 3개 중 하나를 강조 표시할 수 있어서, 클라이언트 컴포넌트로 만듦
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.css";

// 아직 로그인 기능을 안 만들어서, 실제 서버 데이터를 못 받아옴
// 그래서 HeroBanner의 small/showText처럼 "Props로 값을 받되, 안 넘겨주면 기본값을 쓰는" 방식으로 만들어둠
// 나중에 layout.tsx에서 useQuery(FETCH_USER_LOGGED_IN)로 받은 진짜 이름/포인트를 넘겨주기만 하면
// 이 컴포넌트 내부는 하나도 안 고쳐도 됨
type UserInfoProps = {
  name?: string;
  point?: number;
};

// 마이페이지 안에서 이동할 수 있는 메뉴 3개
// label: 화면에 보일 글자, href: 눌렀을 때 이동할 주소
const MENU_ITEMS = [
  { label: "거래내역&북마크", href: "/mypage/transactions" },
  { label: "포인트 사용 내역", href: "/mypage/points" },
  { label: "비밀번호 변경", href: "/mypage/password" },
];

export default function UserInfo({ name = "이름 없음", point = 0 }: UserInfoProps) {
  // 지금 주소가 "/mypage/password"인지 "/mypage/points"인지 등을 알아냄
  const pathname = usePathname();

  return (
    <div className={styles.card}>
      <p className={styles.title}>내 정보</p>

      {/* 프로필 사진 + 이름 */}
      <div className={styles.profile}>
        <div className={styles.profileImg} />
        <p className={styles.name}>{name}</p>
      </div>

      <div className={styles.divider} />

      {/* 보유 포인트 */}
      <div className={styles.pointRow}>
        <span className={styles.pointIcon} aria-hidden="true" />
        <p className={styles.pointValue}>
          {/* toLocaleString(): 숫자를 "23000" → "23,000"처럼 천 단위 콤마가 붙은 글자로 바꿔줌 */}
          {point.toLocaleString()}
          <span className={styles.pointUnit}>P</span>
        </p>
      </div>

      <div className={styles.divider} />

      {/* 마이페이지 안 메뉴 이동 */}
      <nav className={styles.menu}>
        {MENU_ITEMS.map((item) => {
          // 지금 보고 있는 주소가 이 메뉴의 주소로 시작하면 "선택된 메뉴"로 취급
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
            >
              <span>{item.label}</span>
              <span className={styles.arrow} aria-hidden="true">
                ›
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
