// 로그인한 회원 정보를 서버에서 가져오고, 지금 어느 메뉴에 이는지도
// 실시간으로 알아야 함

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import { FETCH_USER_LOGGED_IN } from "@/graphql/queries";
import type { User } from "@/types/user";
import styles from "./styles.module.css";

// 카드 안에 세로로 나열되는 메뉴 3개

const MENU_ITEMS = [
  { label: "거래내역&북마크", href: "/mypage/transactions" },
  { label: "포인트 사용 내역", href: "/mypage/points" },
  { label: "비밀번호 변경", href: "/mypage/password" },
];

export default function UserInfo() {
  // 지금 주소가 뭔지 알아내서, 메뉴 3개 중 어떤 걸 굵게 표시할 지 판단할 때 사용
  const pathname = usePathname();

  // 로그인한 사용자 정보를 서버에 물어봄
  // fetchUserLoggedIn: User 부분 : 결과 데이터 안에는 fetchUserLoggedIn이라는 이름으로
  // User 모양의 값이 들어있을 거야 라고 TypeScript에게 미리 알려주는 것

  const { data } = useQuery<{ fetchUserLoggedIn: User }>(FETCH_USER_LOGGED_IN);

  // data가 아직 안 왔거나, 로그인이 안되서 에러가 났으면 undefined일 수 있음
  // ? 옵셔널 체이닝을 통해, data가 undefined면 에러 내지 않고 미리 알려준다.
  const user = data?.fetchUserLoggedIn;

  return (
    <div className={styles.card}>
      <p className={styles.title}>내 정보</p>

      <div className={styles.profile}>
        {/* 프로필 사진 주소가 있으면 이미지, 없으면 빈 회색 원 */}
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className={styles.profileImg}
          />
        ) : (
          <div className={styles.profileImgEmpty} />
        )}

        <p className={styles.name}>{user?.name ?? "게스트"}</p>
      </div>

      <div className={styles.divider} />

      <div className={styles.pointRow}>
        <span className={styles.pointIcon} aria-hidden="true" />
        <p className={styles.pointValue}>
          {/* toLocaleString : 숫자 23000을 23,000 형태로 이쁘게 변환 */}
          {(user?.userPoint.amount ?? 0).toLocaleString()}
          <span className={styles.pointUnit}> P</span>
        </p>
      </div>

      <div className={styles.divider} />

      <nav className={styles.menu}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

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
