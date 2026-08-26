// main , 그룹 공통 레이아웃 (헤더 포함)
// main/layout.tsx가 정하는게 아니라, Next.js가 사용자가 지금 어떤 주소로 들어왔는 지 보고 자동으로 결정함

import type { ReactNode } from "react";

// 폴더 안 index.tsx를 자동으로 찾아서 가져와줌
import Header from "@/components/commons/header";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {/* 헤더를 화면 위쪽에 그린다. */}
      {children}
      {/* 그 아래에 실제 내용이 들어온다. */}
    </>
  );
}
