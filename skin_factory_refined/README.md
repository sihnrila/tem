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

## 구조
```
skin_factory_refined/
  base/
    cafe24/pages/        # 실제 Cafe24 모듈 템플릿
    assets/              # tokens/theme/options/cart
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

## 결과물
- `dist/skin-001/` 내 Cafe24 페이지/자산
- `dist/skin-001/market/` 판매 문서
- `dist/skin-001/marketing/` 썸네일 3종

## 참고
- Cafe24 모듈 표준: xans-* 모듈 기반
- Playwright 필요: `npx playwright install`
