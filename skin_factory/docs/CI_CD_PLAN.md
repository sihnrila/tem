# CI/CD PLAN

## 목표
- 월 20 스킨 자동 생성
- 마켓 페이지/썸네일 생성
- 릴리즈 패키징

## Workflow
1. generate.js로 dist 생성
2. market-generator.js로 판매 문서 생성
3. render-thumbnails.js로 이미지 생성
4. zip 패키징
5. GitHub Release 업로드
