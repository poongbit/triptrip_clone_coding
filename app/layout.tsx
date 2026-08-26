// 가장 바깥쪽 (모든 화면 공통)
// Next.js가 어떤 주소로 들어오든 무조건 한번은 거치는 가장 바깥쪽 틀
// 사용자가 어떤 주소로 들어왔는 지에 따라 Next.js가 자동으로 채워주는 빈칸
// 예를 들어, 사용자가 /login 주소로 들어오면, Next.js가 알아서 login/page.tsx의 내용을 통째로 {children}자리에 쏙 끼워줌

// Next.js가 미리 만들어둔 타입, "브라우저 탭 제목, 설명 같은 메타정보는 이런 모양이어야 한다는 설계도"
import type { Metadata } from "next";

// "화면에 그릴 수 있는 것들의 총집합" 타입
import type { ReactNode } from "react";

// 우리가 만든 Apollo 설정파일을 가져옴
import ApolloSetting from "@/components/providers/apollo-setting";

// 전역 스타일 파일
import "./globals.css";

// Next.js가 알아서 읽다가 브라우저 탭 제목, 검색 엔진에 노출될 설명 등을 자동으로 써줌
export const metadata: Metadata = {
  title: "TripTrip",
  description: "TripTrip 과제",
};

// RootLayoutProps가 받을 값은 children 하나고, 타입은 ReactNode
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      {/* 이 프로젝트에서 가장 바깥 HTML 태그 */}

      <body>
        {/* 모든 페이지에서 Apollo를 쓸 수 있게 여기서 딱 한 번만 감싸줌 */}
        <ApolloSetting>{children}</ApolloSetting>
      </body>
    </html>
  );
}
