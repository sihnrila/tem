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

## 구조
```
skin_factory_refined/
  base/
    cafe24/pages/        # 실제 Cafe24 모듈 템플릿
    assets/              # tokens/theme/options/cart
  templates/s130/        # S130 가구 브랜드 템플릿
    index.html           # 메인 페이지
    list.html            # 상품 리스트 페이지
    detail.html          # 상품 상세 페이지
    theme.css            # 커스텀 스타일시트
    images/              # 상품 이미지 (1~10.png)
  variants/              # 변형 스펙
  tools/                 # generate/market/thumbnail
  dist/                  # 생성 결과
  docs/                  # QA/Branding/CI-CD
```

## 실행
```bash
npm install
npm run build
npm run market
npm run thumbs
```

## 로컬 미리보기
```bash
cd skin_factory_refined/templates/s130
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
