# 두통 기록 차트 — Frontend (Next.js)

두통이 올 때마다 투약 사항과 상태를 기록하는 개인 기록 앱의 프론트엔드.
(백엔드: [headache-log-backend](https://github.com/HANJIYEONN/headache-log-backend) / 원본 모노레포: [headache-log](https://github.com/HANJIYEONN/headache-log))

## 스택

- **Next.js** (React + TypeScript) + **Tailwind CSS**
- 연한 민트 파스텔 테마
- Google 로그인 (@react-oauth/google) — 커스텀 디자인 버튼

## 화면 구성

- **로그인 페이지** — 뇌 아이콘(직접 그린 SVG) + 구글 로그인 버튼
- **입력 폼** — 날짜 · 약 종류(자동완성) · 복용횟수 · 효과여부 · 촉발요인 · 혈압(선택) · 생리기간
- **자주 복용하는 약** (최대 3개) — 버튼 한 번으로 저장해둔 내용 그대로 오늘 기록, 수정/삭제 지원
- **3탭 뷰**
  - 목록: 전체 항목 테이블 + 수정/삭제
  - 달력: 두통 있던 날 표시, 날짜 클릭 시 상세
  - 차트: 월별 두통 횟수(세로축 눈금), 촉발요인 TOP 5

## 지금까지 만든 기능 (2026-07-14 ~ 07-18)

| 날짜 | 내용 |
|---|---|
| 07-14 | 기록 입력 폼 + 목록, 백엔드 연동 |
| 07-15 | 3탭(목록/달력/차트), 기록 수정, 파스텔 민트 테마, 약 종류 자동완성 |
| 07-16 | Google 로그인, 미로그인 접근 차단, 로그아웃, 로그인 페이지 디자인 |
| 07-17 | 자주 복용하는 약(즐겨찾기) 전체 기능 |
| 07-18 | 모노레포에서 프론트 분리 (Vercel 배포 준비) |

## 로컬 실행

```bash
npm install
npm run dev   # http://localhost:3000
```

**환경변수** (`.env.local` — git에 안 올라가요):

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=구글_OAuth_클라이언트_ID
NEXT_PUBLIC_API_URL=백엔드_주소   # 없으면 http://localhost:8000
```

## 배포 (Vercel)

1. Vercel에서 이 저장소 import (루트가 곧 앱이라 추가 설정 불필요)
2. 환경변수 2개 등록: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_API_URL`(오라클 서버 주소)
3. 배포 후 Google Cloud Console → OAuth 승인된 자바스크립트 원본에 Vercel 주소 추가
