# Skin Factory Refined

Cafe24 반응형 스킨 팩토리 시스템 (정교화 버전)

## 완료된 범위
- Cafe24 페이지 템플릿 정교화 (xans-* 모듈 구조)
- 옵션 UI 개선 (select → 버튼 UI, 실제 change 이벤트 유지)
- 카트 드로어 + 오버레이 + fallback 연동
- PDP 갤러리 구조: 좌측 썸네일 레일 + 메인 이미지
- Feature 토글 데이터 주입 (freeShippingBar/reviewHighlight/cartDrawer/trustBadges)
- 썸네일 HTML 템플릿 분리 + 배경 이미지 연결
- 마케팅 문서/썸네일 자동 생성 파이프라인

---

## S130 가구 브랜드 커스터마이징

### 콘텐츠 변경
- 전체 상품 데이터를 가구 브랜드(체어 10종)로 교체
  - 상품명, SKU, 설명, 가격을 1~10번 이미지에 매핑
  - 메인 상품 섹션 1·2, 상품 그리드 1·2, 슬라이더, 리스트 페이지 일괄 반영
- 카테고리 메뉴를 가구 카테고리로 변경 (Lounge, Dining, Office, Accent 등)
- 텍스트 배너 카피 변경: "Furniture that feels timeless to live."
- 헤더/사이드 네비게이션 메뉴 구조 업데이트

### 슬라이더 (Swiper)
- 전체 10개 상품을 슬라이드로 포함하여 **무한 루프** 정상 작동
- Swiper 설정: `loop: true`, `freeMode`, `autoplay: { delay: 0 }`, `speed: 5000`
- `transition-timing-function: linear`으로 끊김 없는 연속 스크롤
- 반응형 브레이크포인트: 모바일 1개 → 태블릿 2개 → 데스크탑 3개 → 와이드 4개
- 슬라이더 상품 카드 디자인을 메인 그리드 상품과 동일하게 통일

### 레이아웃 & 스타일
- 섹션 간 위아래 패딩/마진 일관성 확보 (`big-section` 80px 기준 통일)
- 텍스트 배너 불필요한 `margin-bottom` 제거
- 사이드 메뉴 하단 영역 항상 바닥 고정 (flexbox `margin-top: auto`)
- 푸터 폰트를 본문 폰트(`--ko-font`)로 통일

### 상세 페이지 (detail.html)
- 모든 외부 Unsplash 이미지를 로컬 이미지(`images/`)로 교체

### 리스트 페이지 (list.html)
- 전체 10개 상품을 4컬럼 그리드로 표시
- 메인 페이지 상품 카드와 동일한 크기 및 디자인 적용

---

## Cafe24 모듈 변환

정적 HTML 템플릿을 카페24 스킨편집기에서 바로 사용할 수 있는 모듈 형식으로 변환 완료.

### 레이아웃 시스템
- `layout/basic/header.html` — 공통 헤더 레이아웃
  - `<head>`: CSS (base/framework/theme/swiper), 폰트(SUIT), 아이콘(unicons), jQuery, GSAP
  - 상단 헤더 네비게이션 (카페24 URL 적용)
  - 사이드 메뉴 (`layout_logoff`/`layout_logon` 회원 모듈 포함)
  - `<div id="container"><div id="contents">` 시작
- `layout/basic/footer.html` — 공통 푸터 레이아웃
  - 모바일 하단 네비게이션 (장바구니 카운트 모듈)
  - 푸터 (이용약관/개인정보 카페24 링크)
  - 검색 오버레이
  - 공통 JS (헤더 고정, 네비 토글, 카테고리 호버, 검색)

### 페이지별 모듈 적용

| 페이지 | 카페24 모듈 | 용도 |
|---|---|---|
| `index.html` | `product_listmain_1~5` | 메인 상품진열 5개 슬롯 |
| `list.html` | `product_listnormal`, `product_listmore` | 카테고리 상품 리스트 |
| `detail.html` | `product_image`, `product_detail`, `product_option`, `product_action`, `product_review`, `product_qna`, `product_relation` | 상품 상세 전체 |
| `cart.html` | `Order_NormalType` | 장바구니 목록/주문 |
| `login.html` | `member_login` | 회원 로그인 폼 |
| `mypage.html` | `myshop_main_summary`, `myshop_order_list` | 마이페이지 요약/주문내역 |
| `new-arrivals.html` | `product_listnormal`, `product_listmore` | 신상품 리스트 |
| `sale.html` | `product_listnormal`, `product_listmore` | 세일 상품 리스트 |
| `notice.html` | `board_list_1` | 공지사항 게시판 |
| `faq.html` | `board_list_3` | FAQ 게시판 |
| `qna.html` | `board_list_4` | Q&A 게시판 |
| `review.html` | `board_list_5` | 리뷰 게시판 |
| `about.html` | 커스텀 HTML | 회사소개 |
| `archive.html` | 커스텀 HTML | 브랜드 스토리 |
| `community.html` | 커스텀 HTML | 커뮤니티 허브 링크 |
| `contact.html` | 커스텀 HTML | 연락처 정보 |
| `shorts.html` | 커스텀 HTML | 숏폼 콘텐츠 |

### 백업
- `s130_backup/` — 카페24 모듈 변환 전 정적 HTML 원본 보관

---

## 구조
```
skin_factory_refined/
  templates/s130/              # Cafe24 모듈 버전 (배포용)
    layout/basic/
      header.html              # 공통 헤더 레이아웃
      footer.html              # 공통 푸터 레이아웃
    index.html                 # 메인 페이지
    list.html                  # 상품 리스트
    detail.html                # 상품 상세
    about.html                 # 회사소개
    cart.html                  # 장바구니
    login.html                 # 로그인
    mypage.html                # 마이페이지
    notice.html / faq.html     # 게시판
    qna.html / review.html     # 게시판
    new-arrivals.html          # 신상품
    sale.html                  # 세일
    community.html             # 커뮤니티
    contact.html               # 연락처
    archive.html               # 스토리
    shorts.html                # 숏츠
    theme.css                  # 커스텀 스타일시트
    base.css / framework.css   # 기본 CSS
    swiper-bundle.min.*        # Swiper 라이브러리
    images/                    # 상품 이미지 (1~10.png)
  templates/s130_backup/       # 정적 HTML 원본 백업
  base/
    cafe24/pages/              # 실제 Cafe24 모듈 템플릿
    assets/                    # tokens/theme/options/cart
  variants/                    # 변형 스펙
  tools/                       # generate/market/thumbnail
  dist/                        # 생성 결과
  docs/                        # QA/Branding/CI-CD
```

## 카페24 적용 방법

### 1. 파일 업로드
카페24 관리자 > 디자인 > 스킨편집기 > FTP/파일관리 에서:
- `/skin/s130/` 경로에 CSS, JS, 이미지 파일 업로드
- `/layout/basic/` 경로에 `header.html`, `footer.html` 붙여넣기

### 2. 페이지별 HTML 붙여넣기
각 페이지 파일의 내용을 카페24 스킨편집기의 해당 파일에 붙여넣기:
- `index.html` → 메인 페이지
- `/product/list.html` → 상품 목록
- `/product/detail.html` → 상품 상세
- 기타 서브페이지 동일하게 적용

### 3. 관리자 설정
- **메인진열관리**: 메인상품진열 1~5번에 상품 등록
- **상품분류관리**: 카테고리 생성 후 URL 연결
- **게시판관리**: 공지/FAQ/Q&A/리뷰 게시판 번호 확인 후 module 번호 일치

## 로컬 미리보기 (정적 버전)
```bash
cd skin_factory_refined/templates/s130_backup/s130
python3 -m http.server 8877
# http://localhost:8877/index.html
```

## 결과물
- `dist/skin-001/` 내 Cafe24 페이지/자산
- `dist/skin-001/market/` 판매 문서
- `dist/skin-001/marketing/` 썸네일 3종

## 참고
- Cafe24 모듈 표준: xans-* 모듈 기반
- Playwright 필요: `npx playwright install`
