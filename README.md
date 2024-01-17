# js 공통 라이브러리

## 01. 프로젝트 정보

- 홈페이지 구축
  <br>

## 02. 폴더 구조

#### js개발용

- src\js\classes => 공통 라이브러리 및 콘텐츠 스크립트
- src\js\library => 외부 라이브러리

#### js배포용 & 산출물

- resource\dist\jquery.min.js => jquery 버전의 경우 개발과 협의 필요
- resource\dist\library.js => jquery를 제외한 외부 라이브러리 모음, 개발에서 jquery를 사용하지 않는 경우는 한 파일로 묶어도 무방
- resource\dist\commonJs.js => 컨텐츠 모음

## 03. 환경

- nodejs : npm의로 관리 16.14.1 (다운로드) https://nodejs.org/en/
- live-server : vscode내 live serve 사용

## 04. 설치 및 npm script

- npm i
- npm run dev (개발버전)
- npm run build (배포버전)
- ~~npm run build:min (압축 및 주석, 콘솔 제거 배포버전) / 현재 미사용 ~~
- npm run jsdoc 주석을 기반으로 가이드 문서를 html 생성 해줍니다.

- crtl + c (watch 정지)

## 05. 사용 라이브러리 (package.json 참고)

- jquery
- jquery-ui
- swiper

## 06. global variable (00index.js 선언)

- mvJs.fn
- ex) mvJs.fn.popup.open(), mvJs.fn.popup.close() ...
- 백엔드와 연동을 하거나 외부에서 함수를 호출을 하기 위한 용도

- mvJs.pn
- import 문을 사용하고 있지 않기 때문에 스크립트 내부적으로 사용할 공통 모듈 네임스페이스

## 07. 배포

- 실서버에 반영시에 build된 파일을 배포 해야함, dev의 경우는 js문서내에 테스트용 소스맵 코드가 붙기 때문에 용량이 늘어납니다.

<br><br>
