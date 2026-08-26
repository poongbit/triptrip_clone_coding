// Apollo-setting : "한번만 설정 하고, 앱 전체에서 재사용하기 위해서
// app/layout.tsx에서 <ApolloSetting>으로 감싸주면, 그 안의 모든 화면에 별 다른 설정 없이
// useQuery, useMutation 같은 것을 바로 갖다 쓸 수 있음
// "위에서 한 번 감싸고, 아래 모든 컴포넌트가 공유해서 쓰는 패턴" => "Provider Pattern" 이라고 한다.

// Next.js는 기본적으로 서버에서 미리 화면을 그리는데,
// use client를 붙히면, "이 파일은 브라우저에서 실행해줘" 라는 예외 처리를 시킴
"use client";

// ApolloClient : Apollo의 "완성품을 만드는 틀"
// ApolloLink : 요청이 나가기 전에 중간에서 뭔가 처리하고 싶을 때 쓰는 틀
// HttpLink : "어디로, 어떻게 요청 보낼 지 " 정하는 틀
// InMemoryCache : 받아온 데이터를 잠시 기억해두는 저장소

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

// 화면(컴포넌트)들에게 Apollo 설정을 나눠주는 도구. React 전용이라 경로가 따로 있음
import { ApolloProvider } from "@apollo/client/react";

// "화면에 그릴 수 있는 모든 것"을 뜻하는 타입(설계도) 만 가져옴
import type { ReactNode } from "react";

// new를 통해 "http 전용 틀(HttpLink)"을 완성.
// uri : 요청을 보낼 주소. Next.js의 /api/graphql/route.ts 파일의 주소
// credentials : 쿠키 등 인증 정보를 함께 보내도록 설정

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

// operation : 지금 막 나가려는 요청 (예 : 게시글 목록 주세요)
// forward : "전달해줘" 라는 뜻. 이걸 안 호출하면 요청이 나가지 않음. 그리고 최종 응답(결과값)을 돌려줌
// Apollo가 "네가 만든 함수, 내가 대신 실행할께"라고 약속하고, 대신 실행에 필요한 도구 두 개(operation, forward)를 인자로 넘겨주는 구조

const authLink = new ApolloLink((operation, forward) => {
  const accessToken =
    // 지금 이 코드가 브라우저에서 돌고 있는 게 맞는 지 확인
    typeof window === "undefined" ? "" : localStorage.getItem("accessToken");

  // 지금 나가는 요청(operation)에 "추가 정보를 끼워넣어라" 라는 함수
  operation.setContext({
    headers: {
      // 토큰이 있으면 -> "Bearer 토큰값" 형태의 글자로 만들어서 넣음
      // Bearer : "이 토큰을 가진 사람이 요청한 거에요."를 서버에 알리는 정해진 표현
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  });

  // 출입증 꽃는 작업이 끝났으니, 이 요청을 다음 단계(httpLink)로 넘겨줘 라는 뜻
  return forward(operation);
});

const client = new ApolloClient({
  // .concat()를 통해 authLink 다음에 httpLink를 실행하도록 순서를 정함
  // 1) authLink에서 토큰 꽃기, 2) httpLink에서 진짜 요청 보내기
  link: authLink.concat(httpLink),

  // 한 번 받은 요청은 메모리에 기억해뒀다가, 똑같은 요청이 오면 재활용함.
  cache: new InMemoryCache(),
});

// 1. "이 컴포넌트가 밖에서 어떤 값을 받을 지" 설계도 먼저 쓰기
// ApolloSetting이라는 컴포넌트는 children이란 타입을 받는데
// "그 값은 ReactNode(화면에 그릴 수 있는 것) 타입이어야 한다"는 설계도

type ApolloSettingProps = {
  children: ReactNode;
};

// export default : 이 함수를 다른 파일에서도 가져다 쓸 수 있게 내보낸다.
// 나중에 실제로 실행(호출)되는 건, app/layout.tsx에서 쓰임

// 이 함수가 나중에 실제로 호출 될 때, 넘겨받을 값에서 children이라는 걸 바로 쓰고,
// 넘겨 받는 값 전체의 모양은 ApolloSettingProps를 따른다 라는 약속.

export default function ApolloSetting({ children }: ApolloSettingProps) {
  // {children}만 return하면 화면은 잘 나오겠지만, 아무 연결도 안됨
  // return을 <ApolloProvider>로 감싸주면, 자식 컴포넌트들은 <ApolloClient>가 설정한
  // 설정값(어디로 보낼지, 메모리는 어떻게 쓸지 등등)을 공유하면서 동작할 수 있게됨
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

// 2. 함수 이름 = 이 파일이 만드는 화면(컴포넌트)의 이름
// 3. 괄호 안 { 받을값이름 } = 넘겨받은 값 중에서 바로 꺼내 쓸 이름들
// 4. : 무언가Props = 그 값들의 타입은 위에서 만든 설게도를 따른다.
// 코드는 돌아가는데, 타입이 있으면 실수를 미리, 빨리 잡아주고 자동완성도 도와줌.
