// 헤더는 "지금 내가 어떤 페이지에 있는지"에 따라 메뉴 글씨가 달라져야 해서
// 브라우저에서 계속 값이 바뀌는 걸 감지해야 함 → 그래서 클라이언트 컴포넌트가 필요함
"use client";

// Link: <a> 태그 대신 쓰는 Next.js 전용 링크. 페이지를 완전히 새로고침하지 않고
// 필요한 부분만 바꿔치기해서 이동시켜주기 때문에 훨씬 빠름
import Link from "next/link";

// usePathname: "지금 주소창에 어떤 경로가 떠 있는지" 문자열로 알려주는 훅
// 예) 지금 보고 있는 주소가 https://.../mypage/password 라면 "/mypage/password"를 돌려줌
import { usePathname } from "next/navigation";

import styles from "./styles.module.css";

// 헤더 가운데 메뉴 3개를 배열 하나로 관리
// href: 실제로 눌렀을 때 이동할 주소
// activePrefix: "지금 이 메뉴를 굵게 표시해야 하나?"를 판단할 때 기준으로 삼을 주소
const NAV_ITEMS = [
  { label: "트립토크", href: "/", activePrefix: "/" },
  { label: "숙박권 구매", href: "/travelproducts", activePrefix: "/travelproducts" },
  { label: "마이 페이지", href: "/mypage/password", activePrefix: "/mypage" },
];

export default function Header() {
  // 렌더링될 때마다 "지금 주소가 뭐지?"를 물어봄
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          {/* 로고를 누르면 홈("/")으로 이동 */}
          <Link href="/" className={styles.logo}>
            <img src="/triptrip.png" alt="트립트립 로고" />
          </Link>

          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => {
              // "/"는 모든 주소가 다 "/"로 시작하기 때문에 startsWith로 검사하면 안 되고
              // 정확히 똑같은지(===)로만 검사해야 함
              // 나머지 메뉴는 하위 페이지(/mypage/xxx 등)에 있어도 계속 활성화되도록 startsWith로 검사
              const isActive =
                item.activePrefix === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.activePrefix);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  // 두 클래스를 공백으로 이어붙임: 기본 스타일 + (활성화면 강조 스타일 추가)
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 오른쪽 프로필 영역. 로그인 기능을 아직 안 만들어서 지금은 자리만 잡아둠 */}
        {/* 나중에 로그인 기능을 만들면, 여기를 실제 회원 사진(FETCH_USER_LOGGED_IN 결과)으로 바꿀 예정 */}
        <div className={styles.right}>
          <div className={styles.profileImg} />
          <span className={styles.arrow} aria-hidden="true">
            ▾
          </span>
        </div>
      </div>
    </header>
  );
}
