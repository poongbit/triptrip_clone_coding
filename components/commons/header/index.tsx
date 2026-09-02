// 헤더는 "지금 내가 어떤 페이지에 있는지", "로그인 상태인지"에 따라
// 보여지는 내용이 계속 바뀌어야 해서 클라이언트 컴포넌트가 필요함
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApolloClient, useQuery } from "@apollo/client/react";

import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import type { User } from "@/types/user";
import styles from "./styles.module.css";

// 헤더 가운데 메뉴 3개를 배열 하나로 관리
const NAV_ITEMS = [
  { label: "트립토크", href: "/", activePrefix: "/" },
  {
    label: "숙박권 구매",
    href: "/travelproducts",
    activePrefix: "/travelproducts",
  },
  { label: "마이 페이지", href: "/mypage/password", activePrefix: "/mypage" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const client = useApolloClient();

  // 서버에는 localStorage가 없어서, 처음엔 무조건 "비로그인" 상태("")로 시작해야 함.
  // 그래야 서버가 미리 그려준 화면과 브라우저가 처음 그리는 화면이 똑같아서
  // hydration mismatch(서버/클라이언트 결과가 달라서 나는 경고)가 안 생김
  const [accessToken, setAccessToken] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // setState를 useEffect 안에서 바로(동기적으로) 부르면 렌더링이 연쇄적으로
    // 일어나 성능에 안 좋다는 경고(react-hooks/set-state-in-effect)가 뜸.
    // requestAnimationFrame으로 한 박자 늦춰서(화면이 한 번 그려진 다음) 실행하면
    // 그 경고를 피하면서도, "브라우저에 다 그려진 다음 토큰 확인하기"라는 목적은 그대로 달성함
    const frameId = requestAnimationFrame(() => {
      const savedAccessToken = localStorage.getItem("accessToken") ?? "";
      setAccessToken(savedAccessToken);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  // accessToken이 빈 문자열이면(비로그인) 아예 요청을 보내지 않음 -> skip 옵션
  const { data } = useQuery<{ fetchUserLoggedIn: User }>(
    FETCH_USER_LOGGED_IN,
    {
      skip: accessToken === "",
      ssr: false,
    },
  );

  const user = data?.fetchUserLoggedIn;
  const point = user?.userPoint?.amount ?? 0;

  const onClickLogout = async () => {
    localStorage.removeItem("accessToken");
    setAccessToken("");
    setIsMenuOpen(false);
    // 로그인 상태로 캐싱해둔 데이터(내 정보 등)를 전부 지워서,
    // 다음에 로그인했을 때 예전 사용자 정보가 잠깐이라도 보이지 않게 함
    await client.clearStore();
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <img src="/triptrip.png" alt="트립트립 로고" />
          </Link>

          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.activePrefix === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.activePrefix);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 로그인 여부에 따라 오른쪽 영역이 완전히 다르게 보임 */}
        {accessToken === "" ? (
          <Link className={styles.loginButton} href="/login">
            로그인 <span>›</span>
          </Link>
        ) : (
          <div className={styles.right}>
            <button
              type="button"
              className={styles.profileButton}
              aria-expanded={isMenuOpen}
              aria-label="프로필 메뉴 열기"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className={styles.profileImg} />
              <span className={styles.arrow} aria-hidden="true">
                {isMenuOpen ? "▴" : "▾"}
              </span>
            </button>

            {isMenuOpen && (
              <div className={styles.profileMenu}>
                <div className={styles.menuTop}>
                  <span className={styles.profileImg} />
                  <strong>{user?.name ?? "사용자"}</strong>
                </div>

                <div className={styles.menuRow}>
                  <span>포인트</span>
                  <strong>{point.toLocaleString()} P</strong>
                </div>

                <button
                  type="button"
                  className={styles.logoutButton}
                  onClick={onClickLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
