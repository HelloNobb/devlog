# 📚 Dev-Log

> 개발자를 위한 올인원 학습 기록 및 관리 플랫폼

## 📖 프로젝트 소개

**Dev-Log**는 개발자의 학습과 성장을 체계적으로 기록하고 관리하는 웹 애플리케이션입니다. 알고리즘 문제 풀이, CS 지식 학습, 프로젝트 관리, 트러블슈팅 경험 등 개발자에게 필요한 모든 학습 활동을 한 곳에서 관리할 수 있습니다.

### 🎯 주요 목적

- **체계적인 학습 기록**: 일별/주별 학습 내용을 구조화하여 기록
- **성장 추적**: 학습 진행 상황과 성과를 시각적으로 확인
- **지식 아카이빙**: CS 지식, 알고리즘, 프로젝트 경험 체계적 정리
- **커리어 관리**: 이력서 및 포트폴리오 작성을 위한 데이터 축적

---

## 🛠️ 기술 스택

### **Backend**
| 분류 | 기술 스택 |
|------|----------|
| **프레임워크** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) |
| **언어** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **데이터베이스** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **ORM** | TypeORM |
| **인증** | JWT (JSON Web Token) + Passport |
| **암호화** | bcrypt |
| **유효성 검사** | class-validator, class-transformer |

### **Frontend**
| 분류 | 기술 스택 |
|------|----------|
| **프레임워크** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) |
| **언어** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| **라우팅** | React Router DOM v7 |
| **상태 관리** | Context API |
| **HTTP 클라이언트** | Axios |
| **스타일링** | CSS Modules |

### **개발 도구**
- **API 테스트**: Jest, Supertest
- **코드 품질**: ESLint, Prettier
- **버전 관리**: Git

---

## ✨ 주요 기능

### 1️⃣ **사용자 인증 및 관리**
- JWT 기반 회원가입/로그인
- 보호된 라우트 (ProtectedRoute)
- 자동 로그인 유지 (토큰 기반 인증)
- 사용자별 데이터 격리

### 2️⃣ **알고리즘 학습 관리** (`/algorithms`)
- 백준, 프로그래머스 등 알고리즘 문제 풀이 기록
- 문제 난이도, 소요 시간, 풀이 방법 기록
- solved.ac API 연동으로 문제 정보 자동 가져오기
- 학습 통계 및 진행률 추적

### 3️⃣ **CS 지식 기록** (`/cs-logs`)
- 데이터구조, 알고리즘, 네트워크, OS, 데이터베이스 등 CS 지식 정리
- 카테고리별 분류 및 검색
- 마크다운 형식 지원
- 복습 주기 관리

### 4️⃣ **프로젝트 관리** (`/projects`)
- 개인/팀 프로젝트 등록 및 관리
- 프로젝트별 사용 기술 스택 기록
- 기간, 역할, 성과 관리
- GitHub 링크 연동

### 5️⃣ **트러블슈팅 아카이브** (`/troubleshoots`)
- 개발 중 겪은 문제와 해결 과정 기록
- 문제 상황, 원인 분석, 해결 방법 구조화
- 태그 기반 검색 및 분류
- 유사한 문제 재발견 시 참고 자료로 활용

### 6️⃣ **학습 기록** (`/record`)
- 일일 학습 내용 작성
- 오늘 한 일(TIL) 기록
- 메모 기능

### 7️⃣ **대시보드** (`/`)
- 전체 학습 현황 한눈에 보기
- 최근 활동 타임라인
- 통계 및 차트 시각화
- 학습 목표 달성률

### 8️⃣ **캘린더 뷰** (`/calendar`)
- 월별/주별 학습 활동 시각화
- 일정별 학습 기록 확인
- 학습 패턴 분석

---

## 🏗️ 시스템 아키텍처

### **전체 구조**
```
┌─────────────────────────────────────────────────────────┐
│                    Client (React)                       │
│  - React Router로 SPA 구현                              │
│  - Context API로 전역 상태 관리 (인증)                   │
│  - Axios로 API 통신                                      │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST API
                   │
┌──────────────────▼──────────────────────────────────────┐
│              Server (NestJS)                            │
│  ┌────────────────────────────────────────────────┐    │
│  │  Controllers (라우팅 및 요청 처리)               │    │
│  │  - AuthController, UserController               │    │
│  │  - AlgoController, CsLogController              │    │
│  │  - ProjectController, TroubleshootController    │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │                                    │
│  ┌──────────────────▼─────────────────────────────┐    │
│  │  Services (비즈니스 로직)                        │    │
│  │  - JWT 인증 처리                                │    │
│  │  - CRUD 로직                                    │    │
│  │  - 외부 API 연동 (solved.ac)                    │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │                                    │
│  ┌──────────────────▼─────────────────────────────┐    │
│  │  Repositories (데이터 접근)                      │    │
│  │  - TypeORM Entity & Repository 패턴             │    │
│  └──────────────────┬─────────────────────────────┘    │
└────────────────────┼────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               Database (MySQL)                          │
│  - users, algorithms, cs_logs, projects,                │
│    troubleshoots, memos 등 테이블                       │
└─────────────────────────────────────────────────────────┘
```

### **Backend 모듈 구조**
```
src/
├── app/              # 애플리케이션 루트 모듈
├── auth/             # 인증 모듈 (JWT Strategy, Guards)
├── user/             # 사용자 관리
├── algorithms/       # 알고리즘 문제 풀이 기록
├── cs-log/           # CS 지식 기록
├── project/          # 프로젝트 관리
├── troubleshoot/     # 트러블슈팅 아카이브
├── memo/             # 메모 기능
├── solvedac/         # solved.ac API 연동
├── entities/         # 공통 Entity
└── dto/              # 공통 DTO
```

### **Frontend 구조**
```
src/
├── components/       # 재사용 컴포넌트
│   └── Layout.js    # 네비게이션 바 포함 레이아웃
├── pages/            # 페이지 컴포넌트
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   ├── AlgorithmPage.js
│   ├── CsLogPage.js
│   ├── ProjectPage.js
│   ├── TroubleshootPage.js
│   └── ...
├── context/          # Context API
│   └── AuthContext.js  # 인증 상태 관리
├── api/              # API 호출 함수
└── styles/           # 스타일 파일
```

---

## 🔐 인증 및 보안

### **JWT 기반 인증 흐름**
1. 사용자가 이메일/비밀번호로 로그인
2. 서버에서 bcrypt로 비밀번호 검증
3. 검증 성공 시 JWT 토큰 발급
4. 클라이언트는 localStorage에 토큰 저장
5. 이후 모든 API 요청에 `Authorization: Bearer <token>` 헤더 포함
6. 서버에서 Passport JWT Strategy로 토큰 검증

### **보안 기능**
- 비밀번호 bcrypt 해싱 (단방향 암호화)
- DTO 유효성 검사 (class-validator)
- CORS 설정으로 허용된 Origin만 접근 가능
- whitelist/forbidNonWhitelisted로 불필요한 속성 차단

---

## 🚀 설치 및 실행 방법

### **사전 요구사항**
- Node.js (v16 이상)
- MySQL (v8 이상)
- npm 또는 yarn

### **1. 저장소 클론**
```bash
git clone https://github.com/your-repo/dev-log.git
cd dev-log
```

### **2. Backend 설정**
```bash
cd dev-log-backend

# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
# DB_DATABASE=devlog
# JWT_SECRET=your_secret_key
# PORT=3001

# 데이터베이스 마이그레이션 (TypeORM)
npm run typeorm migration:run

# 개발 서버 실행
npm run start:dev
```

### **3. Frontend 설정**
```bash
cd dev-log-frontend

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm start
```

### **4. 프로덕션 빌드**
```bash
# Backend
cd dev-log-backend
npm run build
npm run start:prod

# Frontend
cd dev-log-frontend
npm run build
```

---

## 📂 데이터베이스 스키마

### **주요 테이블**
- `users`: 사용자 정보 (이메일, 비밀번호, 닉네임 등)
- `algorithms`: 알고리즘 문제 풀이 기록
- `cs_logs`: CS 지식 기록
- `projects`: 프로젝트 정보
- `troubleshoots`: 트러블슈팅 기록
- `memos`: 일일 메모 및 학습 기록

### **관계**
- 각 테이블은 `user_id`로 사용자와 1:N 관계
- TypeORM의 `@ManyToOne`, `@OneToMany` 데코레이터로 관계 정의

---

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 커버리지 확인
npm run test:cov
```

---

## 📝 개발 과정에서 배운 점

### **Backend**
- **NestJS 아키텍처**: 모듈 기반 구조로 확장 가능한 애플리케이션 설계 경험
- **TypeORM**: Entity와 Repository 패턴을 활용한 데이터베이스 설계
- **JWT 인증**: Passport 전략 패턴을 통한 인증/인가 구현
- **DTO & Validation**: class-validator를 활용한 입력 데이터 검증
- **RESTful API 설계**: 자원 중심의 API 엔드포인트 설계 및 HTTP 메서드 활용

### **Frontend**
- **React Router**: 중첩 라우팅과 보호된 라우트 구현
- **Context API**: 전역 상태 관리 (인증 상태)
- **Axios Interceptor**: 요청/응답 전처리 및 에러 핸들링
- **컴포넌트 설계**: 재사용 가능한 컴포넌트 패턴

### **전체 시스템**
- **풀스택 개발**: 프론트엔드와 백엔드 간 API 통신 및 데이터 흐름 이해
- **인증 시스템**: 클라이언트-서버 간 토큰 기반 인증 구현
- **데이터 모델링**: 사용자 시나리오 기반 데이터베이스 스키마 설계

---

## 🎓 향후 개선 계획

- [ ] **실시간 협업 기능**: WebSocket 기반 실시간 알림
- [ ] **소셜 기능**: 다른 개발자와 학습 기록 공유
- [ ] **통계 대시보드 강화**: D3.js/Chart.js로 상세한 시각화
- [ ] **모바일 반응형 디자인**: 모바일 환경 최적화
- [ ] **테스트 커버리지 향상**: 단위 테스트 및 E2E 테스트 확대
- [ ] **CI/CD 파이프라인**: GitHub Actions를 통한 자동 배포
- [ ] **Docker 컨테이너화**: 개발/운영 환경 일관성 확보

---

## 👨‍💻 개발자

**김현지 (Nobb)**
- Email: [khj59105@gmail.com](mailto:khj59105@gmail.com)
- GitHub: [@HelloNobb](https://github.com/HelloNobb)

---

## 📄 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

---

**Made by Nobb**
