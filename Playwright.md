# Playwright 시작하기

- [Playwright 시작하기](#playwright-시작하기)
  - [1. 왜 Playwright를 써야할까?](#1-왜-playwright를-써야할까)
    - [1.1 개발 팀의 제한 사항](#11-개발-팀의-제한-사항)
    - [1.2 기존 클라이언트의 요구사항](#12-기존-클라이언트의-요구사항)
    - [1.3 도입시 기대되는 결과](#13-도입시-기대되는-결과)
  - [2. Playwright란?](#2-playwright란)
    - [2.1 Test generator](#21-test-generator)
    - [2.2 Inspector](#22-inspector)
    - [2.3 경량성](#23-경량성)
    - [2.4 폭넓은 렌더링 엔진을 지원](#24-폭넓은-렌더링-엔진을-지원)
  - [3. 활용방안 시연 및 테스트](#3-활용방안-시연-및-테스트)
    - [3.1 세팅(Prerequisite)](#31-세팅prerequisite)
    - [3.2 테스트 작성 과정.](#32-테스트-작성-과정)
    - [3.3 시연 시나리오(Test generator)](#33-시연-시나리오test-generator)
    - [3.4 시연 시나리오(테스트 과정)](#34-시연-시나리오테스트-과정)
    - [3.5 한계](#35-한계)
      - [포괄적인 Selector](#포괄적인-selector)
- [4. Agenda](#4-agenda)
  - [4.1 Discuss](#41-discuss)
  - [4.2 TODO](#42-todo)
- [5. 테스트란?](#5-테스트란)
- [6. Refer](#6-refer)


## 1. 왜 Playwright를 써야할까?
먼저 vitest, vue3는 unit, component 공식 테스트 라이브러리로 vitest를 사용하고 있습니다 하지만
vite, vue 모두 SPC 를 위한 툴이며, vitest는 SPC, Client-Side Rendering 가 아닌 환경에서는 component 테스팅조차 의도대로 동작하지 않습니다.  

이에 nuxt는 nuxt/test-utils 특히 vue는 playwright 전 cypress에 대한 복잡한 세팅과정을 CLI 사전 세팅을 통해 해결하려 했지만 라이브러리 자체의 문제인 진입장벽, 개발비용, 복잡한 셋업 과정을 커버 할 순 없었습니다. 

그동안 e2e 테스트는 unit test 보다 앱에대한 자신감을 가질 수 있지만, 
훨씬 더 요구되는 개발비용으로 인해 도입이 어려웠었던 것이 현실입니다.
이에 마이크로 소프트의 __Playwright__ 는 아래 특징들을 무기로 위 문제들에 대한 대안을 제시합니다.
### 1.1 개발 팀의 제한 사항
- 프레임워크 진입 장벽
  - 새로운 문서 및 API들에 대한 숙련도가 요구됌
### 1.2 기존 클라이언트의 요구사항
### 1.3 도입시 기대되는 결과


## 2. Playwright란?
TBD
### 2.1 Test generator
TDD 최대 난제 중 하나인 개발비용 단축에 대한 기능이자 우리가 이 라이브러리를 도입 하고자하는 핵심 기능입니다.  
`npx playwright codegen demo.playwright.dev/todomvc`

~~테스트 커버리지를 계산, 모든 파일에 대한 테스트 파일 생성을 기대했으나...~~
### 2.2 Inspector
익숙한 Vue Inspector처럼 Playwright 또한 Inspector를 제공합니다.
이기능은 2개의 window(한쪽은 개발앱 다른쪽은 inspector)를 열게되고
클릭등의 인터랙션을 통해 테스트의 생성, 녹화, 복사, 삭제. 언어변경이가능합니다.

### 2.3 경량성
E2E 테스트 라이브러리는 대체로 무겁고, 느립니다 왜냐하면
매 Test suite(case의 모음)별 브라우저 엔진을 재가동, 재 렌더링해야 하기 때문이죠
저는 Cypress를 사용했었을때 직관적이고 많은 기능을 가지고 있었지만, 많은 기능을 가진 프레임워크 특징인 확장성문제, 커스터마이징 시간소요, 느린 속도로 인해 반드시 구현해야 했던 병렬처리등으로 진행중 삭제한 경험이 있습니다.
- Git Action 연동 및 테스트 결과 보고서 다운로드가능
- 빠름

`Cypress(4.99 MB) > Nightwatch(webdriver required) > Playwright(24.2 kB)`

### 2.4 폭넓은 렌더링 엔진을 지원
   1. 크로미움, 웹킷, 파이어폭스, 
   2. 윈도우, 리눅스, MacOS
   3. headless, headed, 모바일 **emulator**(chrome for android, safari for ios)

## 3. 활용방안 시연 및 테스트

### 3.1 세팅(Prerequisite)
1. vscode 익스텐션 [__ms-playwright.playwright__](https://playwright.dev/docs/getting-started-vscode) 설치
   1. 또는 https://playwright.dev/docs/intro 를 통해 설치 가능합니다.

### 3.2 테스트 작성 과정.
1. 개발된 기능을 localhost 환경에서 구동합니다.
3. `npx playwright codegen {URL}`을 통해 [Test generator](#test-generator) 를 활용, 테스트 코드를 작성합니다.
4. 로컬 환경에서 `test:e2e:ui`(browser),  `pnpm run test:e2e:debug`(vscode)를 이용하여 
테스트합니다 
   1. [관련문서](https://playwright.dev/docs/running-tests)
5. `test:e2e:report`를 통해 면밀히 확인합니다.
6. 개발계 브랜치로 PR/MR을 생성,테스트 과정을 녹화하고, 자동화 테스트를 통해 증명합니다.

### 3.3 시연 시나리오(Test generator) 
1. 서버 구동
2. 
3. Test generator 실시간 생성된 코드와 기작성 코드 비교를 통해 개발 비용 추산
4. 몇퍼센트정도 절감 예상?
### 3.4 시연 시나리오(테스트 과정) 
1. local 환경 테스트 window 구동(e2e:ui) 확인
2. 할일 인덱스 페이지 접근 (http://localhost:3333/guide/samp/el-todo) 확인
3. 2개의 데이터 추가 확인
4. 생성된 2행을 selector 를 통해 확인
5. 2행에 대한 checkbox 클릭 확인
6. 삭제버튼 클릭 확인
7. 빈 테이블 및 no data text 확인
8. 현황,결과 아티팩트 확인 및 다운로드

### 3.5 한계
#### 포괄적인 Selector 
`page.getByRole('button', { name: '미완료' }).click()`. 
위코드는 자동생성 기능을 사용했을때 얻은 테스트 코드로 어떤 행의 미완료 버튼인지 알 수 없습니다.  

`await page.getByRole('button', { name: '미완료' }).nth(1).click()`. 
자동생성기능은 blueprint 개념으로 생성한 이후, 점검 및 수정을 하는 방향으로 개선 할 수 있습니다.

```typescript
// auto


```


# 4. Agenda
## 4.1 Discuss
- TBD Report 저장방식
- Test Directory Structure
  - 테스트 폴더 분리하여 배치
    - test/e2e/{page}, test/unit/{service}, test/component/{service}
  - 각 파일 디렉토리와 동일하게 배치
    - src/components/{component}.spec.ts, src/pages/{page}.spec.ts
  - 디렉토리별 test 폴더 배치
    -   src/components/{service}/A.ts
    -   src/components/{service}/test/A.spec.ts
-   vue-tsc 타입체크를 CI 과정에 포함시킬것인지


## 4.2 TODO
- [ ] 코드, 예시 첨부
- [ ] Test Code 작성에 대한 컨벤션 정의

# 5. 테스트란?
# 6. Refer
- https://docs.cypress.io/guides/core-concepts/testing-types
- https://playwright.dev/docs/intro
- https://wiki.abacussw.co.kr/ko/technote/frontend/javascript/vue-library/full-calendar