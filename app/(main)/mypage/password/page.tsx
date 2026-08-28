// 인풋 값을 실시간으로 기억해야 하고(useState), 버튼 클릭 이벤트도 처리해야 하니까
// 브라우저에서 동작하는 클라이언트 컴포넌트여야 함
"use client";

import { useState } from "react";
// 타입만 따로 가져오는 것들. board-section에서 FormEvent 가져왔던 것과 같은 패턴
import type { ChangeEvent, FormEvent } from "react";

import styles from "./styles.module.css";

import { useMutation } from "@apollo/client/react";

import { RESET_USER_PASSWORD } from "@/graphql/mutations";

export default function PasswordPage() {
  // 새 비밀번호, 비밀번호 확인 두 인풋의 값을 각각 따로 기억해야 하니까 useState를 두 번 씀
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 두 인풋이 다 채워져 있을 때만 true.
  // 피그마의 "최초"(버튼 비활성) ↔ "인풋 filled"(버튼 활성) 상태 차이가 바로 이 값 하나로 결정됨
  const isFilled = password !== "" && passwordCheck !== "";

  // 인풋에 글자를 칠 때마다 실행됨. event.target.value가 "지금 인풋 안에 있는 글자"
  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onChangePasswordCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(event.target.value);
  };

  const [resetUserPassword, { loading }] = useMutation(RESET_USER_PASSWORD);

  // 버튼(submit)을 눌렀을 때 실행됨
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // 원래 <form>은 제출되면 페이지가 새로고침되는데, 그걸 막아줌
    event.preventDefault();

    // 방어 코드: 버튼이 비활성이어도 혹시 모르니 한 번 더 확인
    if (!isFilled) return;

    // 두 비밀번호가 서로 다르면 여기서 멈춤
    if (password !== passwordCheck) {
      alert("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      // variables : mutations.ts에서 $password로 선언해둔 자리에 실제 값을 채워 보냄

      await resetUserPassword({ variables: { password } });

      alert("비밀번호가 변경되었습니다. ");

      setPassword("");
      setPasswordCheck("");
    } catch (error) {
      // 로그인이 안돼 있으면 "회원정보 인증에 실패했습니다." 에러가 잡힘
      alert("비밀번호 변경에 실패했습니다. 로그인 상태를 확인해주세요");
      console.error(error);
    }

    // TODO: 다음 파일(graphql/mutations.ts)에서 진짜 "비밀번호 변경" 요청을 여기에 연결할 예정
    // 지금은 폼 로직만 먼저 완성하는 단계라 콘솔에만 찍어봄
    console.log("비밀번호 변경 요청:", password);
  };

  return (
    <form className={styles.section} onSubmit={onSubmit}>
      <p className={styles.title}>비밀번호 변경</p>

      <div className={styles.form}>
        <div className={styles.inputs}>
          <div className={styles.inputBox}>
            <label className={styles.label} htmlFor="password">
              새 비밀번호
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="새 비밀번호를 입력해 주세요."
              value={password}
              onChange={onChangePassword}
            />
          </div>

          <div className={styles.inputBox}>
            <label className={styles.label} htmlFor="passwordCheck">
              새 비밀번호 확인
            </label>
            <input
              id="passwordCheck"
              type="password"
              className={styles.input}
              placeholder="새 비밀번호를 확인해 주세요."
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
        </div>

        {/* disabled={!isFilled}: isFilled가 false면 disabled가 true가 되면서
            버튼이 눌리지 않고, CSS에서도 회색으로 보이게 처리할 거야(다음 파일에서) */}
        <button
          type="submit"
          className={styles.button}
          disabled={!isFilled || loading}
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </div>
    </form>
  );
}
