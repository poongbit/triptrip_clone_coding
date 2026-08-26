// 브라우저 요청을 실제 API로 전달함
// request.headers, request.text() 등을 사용하려면 NextRequest 타입이 필요하기에 import

import { NextRequest, NextResponse } from "next/server";

// 진짜 데이터가 있는 서버 주소
const GRAPHQL_API = "https://main-practice.codebootcamp.co.kr/graphql";

// async : 이 함수 안에서 기다려야 하는 작업이 있다
// request : 이 함수가 받을 값에 붙힌 이름 (NextRequest 타입의 그릇)
// NextRequest : 그 값이 어떤 모양이어야 하는 지 알려주는 타입 (미리 설계되어 만들어둠)

export async function POST(request: NextRequest) {
  // 이 파일이 route.ts일 때, 함수 이름을 POST로 지으면
  // 누군가가 이 주소로 POST 방식 요청을 보내면 이 함수를 실행해줘 라는 뜻이 됨

  // await : 이 작업이 끝날 때 까지 기다렸다가 다음 줄로 가기
  // "어떤 데이터를 달라는 건지" 적힌 GraphQL 질문 내용 전체가 문자열 형태로 담겨있음
  const query = await request.text();

  // 브라우저가 같이 보낸 출입증(로그인 토큰)과 쿠키를 꺼냄
  // 쿠키 : 서버가 브라우저에가 맡겨두는 작은 메모지
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");

  const headers = new Headers({
    "content-type": "application/json",
    // 왼쪽 값이 없으면 오른쪽 값을 써라.
    // origin : 요청을 보낸 웝사이트 주소, 서버가 "너 어디서 온 요청이야?"를 확인하는 용도
    // CORS, Cross-origin Resource Sharing
    origin: request.headers.get("origin") ?? request.nextUrl.origin,
  });

  // 인증과 쿠키가 있으면 헤더에 설정
  if (authorization) headers.set("authorization", authorization);
  if (cookie) headers.set("cookie", cookie);

  try {
    // 진짜 서버에 보낼 때 같이 실어 보내는 내용
    const apiResponse = await fetch(GRAPHQL_API, {
      method: "POST",
      headers,
      body: query,
      cache: "no-store",
    });

    // 새로운 응답(빈 택배 상자) 하나 새로 포장하기
    // 본문, status, header만 가지고 옴, 쿠키는 따로 저장해야 함
    const result = new NextResponse(await apiResponse.text(), {
      status: apiResponse.status,
      // 상자 겉면 송장 정보로 status, content-type만 우선 붙혀둠
      headers: { "content-type": "application/json" },
    });

    const setCookie = apiResponse.headers.get("set-cookie");

    // 로그인 성공하면 서버가 주는 쿠키도 브라우저에 전달
    // setCookie까지 포함해서 응답 상자에 넣어주기
    if (setCookie) result.headers.set("set-cookie", setCookie);

    return result;
  } catch {
    return NextResponse.json(
      { errors: [{ message: "과제용 API에 연결 불가" }] },
      { status: 502 },
    );
  }
}
