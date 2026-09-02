// 로그인 화면. 이메일/비밀번호를 받아서 loginUser 뮤테이션을 실행하고,
// 성공하면 accessToken을 저장한 뒤 홈으로 이동시킴
"use client";

import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import { LOGIN_USER } from "@/graphql/mutations";
import styles from "../auth.module.css";

// loginUser가 돌려주는 데이터의 모양을 미리 알려주는 타입.
// useMutation<LoginResult>처럼 <> 안에 넣어주면, result.data.loginUser.accessToken을
// 쓸 때 자동완성이 되고 오타도 미리 잡아줌
type LoginResult = {
  loginUser: {
    accessToken: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginUser, { loading }] = useMutation<LoginResult>(LOGIN_USER);

  const onSubmitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === "" || password === "") {
      setErrorMessage("아이디 또는 비밀번호를 확인해 주세요.");
      return;
    }

    try {
      const result = await loginUser({ variables: { email, password } });
      const accessToken = result.data?.loginUser.accessToken;

      if (!accessToken) return;

      // 지금 단계에서는 토큰을 localStorage에 저장함.
      // (나중에 refresh token을 배우면 더 안전한 방식으로 바꿀 예정)
      localStorage.setItem("accessToken", accessToken);
      router.replace("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "로그인에 실패했어요.",
      );
    }
  };

  return (
    <main className={styles.main}>
      <section className={`${styles.formSide} ${styles.loginSide}`}>
        <div className={`${styles.formBox} ${styles.loginBox}`}>
          <Link className={styles.logo} href="/">
            <img src="/triptrip.png" alt="TripTrip" />
          </Link>

          <h1>트립트립에 오신걸 환영합니다.</h1>
          <p className={styles.description}>트립트립에 로그인 하세요.</p>

          <form className={styles.form} onSubmit={onSubmitLogin}>
            <label className={styles.hiddenLabel} htmlFor="email">
              이메일
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력해 주세요."
            />

            <label className={styles.hiddenLabel} htmlFor="password">
              비밀번호
            </label>
            <input
              className={errorMessage ? styles.inputError : ""}
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요."
            />

            <p className={styles.error}>{errorMessage}</p>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <Link className={styles.moveLink} href="/signup">
            회원가입
          </Link>
        </div>
      </section>
      <div className={styles.picture} aria-label="여행지 풍경" />
    </main>
  );
}
