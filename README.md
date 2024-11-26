# Netflix Clone

## 📋 프로젝트 기본 정보
Netflix Clone은 Angular를 기반으로 제작된 영화 정보 제공 웹 애플리케이션입니다. 사용자는 영화 정보를 확인하고, 찜한 영화 목록을 관리하며, 다양한 필터를 통해 원하는 영화를 검색할 수 있습니다.

---

## 🚀 기술 스택

### **프론트엔드**
- **Angular**: 컴포넌트 기반 웹 애플리케이션 개발 프레임워크
- **TypeScript**: 정적 타이핑을 지원하는 JavaScript 언어
- **SCSS**: 스타일링을 위한 CSS 전처리기

### **백엔드**
- **TMDB API**: 영화 정보와 이미지 데이터 제공

### **기타 도구**
- **Cookie Service**: 사용자 로그인 상태 및 쿠키 관리
- **Font Awesome**: 아이콘 사용
- **Ngx-Bootstrap**: UI 컴포넌트

---

## 📁 프로젝트 폴더 구조
├── src/ 
│ ├── app/ 
│ │ ├── components/ # UI 컴포넌트 
│ │ │ ├── header/ # 헤더 컴포넌트 
│ │ │ ├── footer/ # 푸터 컴포넌트 
│ │ │ └── movie-detail/ # 모달 영화 상세정보 
│ │ ├── pages/ # 주요 페이지 
│ │ │ ├── home/ # 홈 페이지 
│ │ │ ├── wishlist/ # 찜한 리스트 페이지 
│ │ │ ├── explore/ # 찾아보기 페이지 
│ │ │ └── new/ # 대세 콘텐츠 페이지 
│ │ ├── util/ # 유틸리티 
│ │ │ ├── movie/ # 영화 관련 API 서비스 
│ │ │ │ ├── movie.service.ts 
│ │ │ │ ├── URL.ts # TMDB API URL 생성 함수 
│ │ │ │ └── useWishlist.ts # 위시리스트 관리 
│ │ │ ├── auth/ # 사용자 인증 관리 
│ │ │ │ └── Authentication.ts 
│ │ ├── app.routes.ts # 애플리케이션 라우팅 설정 
│ │ ├── styles.scss # 전역 스타일링 
│ │ └── main.ts  
│ └── assets/ 
│ └── images/ 
├── angular.json 
├── package.json  
├── tsconfig.json 
└── README.md 

---

## 💡 주요 기능

1. **홈 페이지**
   - 랜덤 영화 배너 표시
   - 카테고리별 인기 영화 표시

2. **찾아보기 페이지**
   - 장르, 언어, 평점 필터를 사용해 영화 검색
   - 무한 스크롤을 통한 영화 로드

3. **찜한 리스트**
   - 로그인한 사용자별 찜한 영화 목록 관리
   - 찜한 영화 추가 및 제거

4. **대세 콘텐츠**
   - 인기 영화 리스트 표시
   - 그리드/리스트 뷰 전환 기능

---

## 📦 설치 및 실행

1. **의존성 설치**
   ```
   npm install
   ```

2. **개발 서버 실행**

bash
코드 복사
ng serve
프로덕션 빌드

bash
코드 복사
ng build --prod
테스트

bash
코드 복사
ng test

## 🛠️ 향후 개선 사항
  - 사용자 리뷰 기능 추가
  - 영화 추천 시스템 도입
  - 성능 최적화 및 코드 리팩토링

