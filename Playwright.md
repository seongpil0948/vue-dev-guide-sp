# Playwright 시작하기

- [Playwright 시작하기](#playwright-시작하기)
  - [1. 왜 Test, Playwright를 써야할까?](#1-왜-test-playwright를-써야할까)
    - [수백줄에 달하는 **단위 테스트 케이스** 목록](#수백줄에-달하는-단위-테스트-케이스-목록)
      - [Playwright는](#playwright는)
    - [아예 수동 테스트를 진행하지 않을 수 있다.](#아예-수동-테스트를-진행하지-않을-수-있다)
      - [Playwright는](#playwright는-1)
  - [Playwright란?](#playwright란)
    - [설치하기](#설치하기)
    - [시작하기](#시작하기)
    - [특징](#특징)
      - [Test generator](#test-generator)
    - [2.2 Inspector](#22-inspector)
    - [2.3 경량성](#23-경량성)
    - [2.4 폭넓은 렌더링 엔진을 지원](#24-폭넓은-렌더링-엔진을-지원)
  - [3. 활용방안 시연 및 테스트](#3-활용방안-시연-및-테스트)
    - [3.1 그래서 우리는 어떻게 테스트 해야할까?](#31-그래서-우리는-어떻게-테스트-해야할까)
    - [3.2 세팅(Prerequisite)](#32-세팅prerequisite)
    - [3.3 테스트 작성 과정.](#33-테스트-작성-과정)
    - [3.4 시연 시나리오(Test generator)](#34-시연-시나리오test-generator)
    - [3.5 시연 시나리오(테스트 과정)](#35-시연-시나리오테스트-과정)
    - [3.6 한계](#36-한계)
      - [3.6.1 포괄적인 Selector](#361-포괄적인-selector)
      - [TODO 무엇을 더 할 수 있을까?](#todo-무엇을-더-할-수-있을까)
- [4. Advanced](#4-advanced)
  - [테스트 도입에 대한 개발자 관점](#테스트-도입에-대한-개발자-관점)
    - [결국 QA팀, 개발팀의 검수가 필요하지 않을까?](#결국-qa팀-개발팀의-검수가-필요하지-않을까)
    - [변수 시나리오 Chaining에 대한 제한](#변수-시나리오-chaining에-대한-제한)
    - [리소스에 대한 보장의 어려움](#리소스에-대한-보장의-어려움)
  - [클라이언트 관점](#클라이언트-관점)
    - [클라이언트는 기술을 가진 회사를 신뢰합니다.](#클라이언트는-기술을-가진-회사를-신뢰합니다)
    - [클라이언트는 산출물이 필요합니다.](#클라이언트는-산출물이-필요합니다)
    - [결국 신뢰를 얻습니다.](#결국-신뢰를-얻습니다)
  - [그래서 왜 Playwright?](#그래서-왜-playwright)
- [5. Refer](#5-refer)


## 1. 왜 Test, Playwright를 써야할까?
우리는 소프트웨어 개발자 입니다. 
당연하게도 우리팀의 작품이 완벽을 추구해야 한다 가 첫번째 이유 입니다.
높은 테스트 커버리지를 보유한 프로젝트는 자신감을 가질 수 밖에 없습니다.
### 수백줄에 달하는 **단위 테스트 케이스** 목록
매 배포마다 수십 페이지에 해당하는 수백개의 케이스를 점검을 해보겠습니다..
첫번째 테스트: **난 완벽주의 개발자!**  자부심을 갖고 꼼꼼하게 테스트 합니다
두번째 테스트: **하루종일 테스트 할 수 있지** 지치지 않습니다 테스트 합니다. 
...
19번째 테스트: ~~input element 하나 추가한건데 해야해?..~~ 테스트 하긴 합니다.
#### Playwright는
E2E 테스트 기능을 통하여, 매 배포마다 모든 시나리오에 대해 Chrome, Firefox, IPhone 실제 브라우저엔진, Emulator 를 구동하여 개발환경이 아닌 사용자 환경에서 검증 할 수 있습니다.

### 아예 수동 테스트를 진행하지 않을 수 있다.
프로젝트를 진행 할 때, 우리는 개발환경을 분리합니다. ex) develope, staging, alpha, beta production
Playwright는 우리에게 선택지를 쥐어줍니다. "QA 및 수동테스트는 **alpha** 이상", "그 **이전버전**은 테스트 코드를 이용해 검증한다."
#### Playwright는
지시사항: Input Element 추가해주세요.
1. 코드작성
```html
<el-input />
```
2. Playwright 실행
``` pnpm run test ``` 
3. dev 브랜치 Merge
4. 이슈 해결.

## Playwright란?
Playwright는 웹 애플리케이션 테스트 및 자동화를 위한 오픈 소스 도구입니다.
브라우저(Chrome, Firefox, Safari 등)를 제어하고 사용자의 행동(클릭, 키 입력, 네비게이션 등)을 시뮬레이션하는 기능을 제공합니다.

### 설치하기

### 시작하기
TODO 설치완료된 스크린샷 첨부
1. `pnpm dlx create-playwright` 명령어를 입력합니다.
2. 설치가 완료 된 경우 `playwright.config.ts` 파일이 생긴 것을 확인 할 수 있습니다.
3. vscode 에디터인경우 [익스텐션 설치](https://playwright.dev/docs/getting-started-vscode)를 참고해주세요.
문제가 있을 경우, [공식 설치페이지](https://playwright.dev/docs/intro#installing-playwright)를 참고 해주세요.
### 특징 

#### Test generator
TDD 최대 난제 중 하나인 개발비용 단축에 대한 기능이자 우리가 이 라이브러리를 도입 하고자하는 핵심 기능입니다.  
`npx playwright codegen demo.playwright.dev/todomvc`

~~테스트 커버리지를 계산, 모든 파일에 대한 테스트 파일 생성을 기대했으나...~~
### 2.2 Inspector
익숙한 Vue Inspector처럼 Playwright 또한 Inspector를 제공합니다.
이기능은 2개의 window(한쪽은 개발앱 다른쪽은 inspector)를 열게되고
클릭등의 인터랙션을 통해 테스트의 생성, 녹화, 복사, 삭제. 언어변경이가능합니다.

### 2.3 경량성
E2E 테스트 라이브러리는 대체로 무겁고, 느립니다 왜냐하면 테스트 브라우저를 설치하고
매 Test suite(case의 모음)별 브라우저 엔진을 재가동, 재 렌더링해야 하기 때문이죠
저는 Cypress를 사용했었을때 직관적이고 많은 기능을 가지고 있었지만, 많은 기능을 가진 프레임워크 특징인 확장성문제, 커스터마이징 시간소요, 느린 속도로 인해 반드시 구현해야 했던 병렬처리등으로 진행중 삭제한 경험이 있습니다.
이에 playwright는 cypress 패키지 사이즈 기준 200배 경량화된 용량, 훨씬 빠른 체감속도로, 최적화에 많은 노력을 기울이고 있습니다.
`Cypress(4.99 MB) > Nightwatch(webdriver required) > Playwright(24.2 kB)`

### 2.4 폭넓은 렌더링 엔진을 지원
   1. 크로미움, 웹킷, 파이어폭스, 
   2. 윈도우, 리눅스, MacOS
   3. headless, headed, 모바일 **emulator**(chrome for android, safari for ios)

## 3. 활용방안 시연 및 테스트
### 3.1 그래서 우리는 어떻게 테스트 해야할까?
INWORK
효율적으로 테스트 하는방법
### 3.2 세팅(Prerequisite)
1. vscode 익스텐션 [__ms-playwright.playwright__](https://playwright.dev/docs/getting-started-vscode) 설치
   1. 또는 https://playwright.dev/docs/intro 를 통해 설치 가능합니다.

### 3.3 테스트 작성 과정.
1. 개발된 기능을 localhost 환경에서 구동합니다.
3. `npx playwright codegen {URL}`을 통해 [Test generator](#test-generator) 를 활용, 테스트 코드를 작성합니다.
4. 로컬 환경에서 `test:e2e:ui`(browser),  `pnpm run test:e2e:debug`(vscode)를 이용하여 
테스트합니다 
   1. [관련문서](https://playwright.dev/docs/running-tests)
5. `test:e2e:report`를 통해 면밀히 확인합니다.
6. 개발계 브랜치로 PR/MR을 생성,테스트 과정을 녹화하고, 자동화 테스트를 통해 증명합니다.

### 3.4 시연 시나리오(Test generator) 
1. 서버 구동
2. 
### 3.5 시연 시나리오(테스트 과정) 
1. local 환경 테스트 window 구동(e2e:ui) 확인
2. 할일 인덱스 페이지 접근 (http://localhost:3333/guide/samp/el-todo) 확인
3. 2개의 데이터 추가 확인
4. 생성된 2행을 selector 를 통해 확인
5. 2행에 대한 checkbox 클릭 확인
6. 삭제버튼 클릭 확인
7. 빈 테이블 및 no data text 확인
8. pr 요청 이미 만들었기 때문에 일단 시연..
9. 현황,결과 아티팩트 확인 및 다운로드

### 3.6 한계
#### 3.6.1 포괄적인 Selector 
`page.getByRole('button', { name: '미완료' }).click()`. 
위코드는 자동생성 기능을 사용했을때 얻은 테스트 코드로 어떤 행의 미완료 버튼인지 알 수 없습니다.  
`await page.getByRole('button', { name: '미완료' }).nth(1).click()`. 
자동생성기능은 blueprint 개념으로 생성한 이후, 점검 및 수정을 하는 방향으로 개선 할 수 있습니다.
#### TODO 무엇을 더 할 수 있을까?
- 엑셀로 페이지 > 테스트 모음 > 케이스 별 분류된 엑셀
우리는 아직도 QA 및 수동테스트를 통해 static(eslint, typescript), unit, integration, e2e, 
component, smocking, api...etc 수 많은 테스트 없이 자부심을 갖고 앱을 출시 할 수 있다고 생각할까요? 그렇다고 trade-off인 테스트 코드 작성에 있어 커버리지 70% 이상을 목표로 삼는 것은 성공한 자사의 앱이 아닌이상 저도 납득 할 수 없는 작업일 것입니다.
클라이언트 및 유저 관점에서 테스트가 필요하다 판단되는 부분을 잘 선별하는 것이 사업특성에 있어 효율적인 개발로 볼 수 있습니다.
# 4. Advanced

## 테스트 도입에 대한 개발자 관점
### 결국 QA팀, 개발팀의 검수가 필요하지 않을까?
당연히 인간의 QA는 필수입니다.하지만 QA 와 테스트코드의 작성은 완전한 교집합이 아닙니다.  
클라이언트 요구사항에 대한 적합성 판단, 더 완전한 유저의 테스트 환경등 다양한 면에서
QA 테스트가 월등하지만 다음과 같은 한계가 있습니다.
###  변수 시나리오 Chaining에 대한 제한
예로 Cloud 사진관리에 대한 구현을 가정 하였을때
1  사진첩동기화  설정을 해둔 기기에서 사진을 기기에 저장 하였을때 원격 저장소 반영여부 확인
2. 곧 바로 네트워크 연결을 종료하고 해당 사진 삭제 
3. 다시 네트워크 연결 후 1분(또는 threshold)이내 원격저장소 동기화 여부확인
위 목록을 엑셀로 관리하고 매번 다른 인원의 테스트 하였을때 누락 될 가능성이 있습니다.

또한 위의 1번->2번 이후, 3번항목이 변경되는 변수(ex 네트워크상태를 나타내는 텍스트 확인 테스트)가 10개로 가정하였을때, 매 배포마다 진행해야 할 테스트 케이스는 10의 배수로 증가합니다.
이처럼 유저 시나리오 관점의 테스트는 왠만한 QA테스트 만으로는 제한이 있습니다.
![screenshot_2023-06-01_at_10.28.49_am.png](/screenshot_2023-06-01_at_10.28.49_am.png)
###  리소스에 대한 보장의 어려움
QA 테스트시 개발자 도구를 통해 ram 메모리 환경등 컴퓨팅 리소스를 낮추는 등의 설정이 가능하지만, 코드 자체에 대한 검증은 어렵습니다.
아래 예제를 버전 1.0.2의 사진을 저장하는 코드로 가정하겠습니다.
```typescript
// src/store/user.ts
export const useAuthStore = defineStore("auth", () => {
  const unsubscribe = observeUser((act) => {
    if(act.behavior === 'savePicture') {
      onSavePicture(act.picture)
    }
  })
  async function userChange() {
    savePicture = true
    onSavePicture(act.picture)
  }
  async function onSavePicture(picture: File){
    if (await isValidPicture(picture)) {
      savePicture(picture)
    }
  }
}
```
위 코드는 회원이 새로운 사진을 저장 하였을때 반응하는 이벤트로
isValidPicture은 살인, 자살, 욕설등의 유해성 콘텐츠를 감지하는 API로 이용료는 장당 1원입니다.
savePicture은 이미지 편집 API를 이용 기기 사이즈에 맞게(400, 800, 1200, 2400)px 총 4장으로 편집하는 API로 장당 1원
그밖에 클라우드 함수일 경우 호출당, NoSQL DB일 경우 문서 저장 당, 추가로 저장시 구동되는 워크플로우가 있을 수 있습니다.
아래는 버전 1.0.3의 다른 팀원의 머지되어버린 PR 입니다.
```typescript
...
// src/user/store/preference.ts
const unsubscribeAuth = authStore.$onAction(
  ({ name, store, args, after, onError }) => {
    after(async () => {
      if (name === 'userChange' && store.state.savePicture) {
        savePicture(store.state.picture)
      }
    });
  },
  true
);
```
새로온 팀원이 userStore 의 action들을 subscribe 하던 store는 savePicture를 중복으로 호출하여,
리소스를 낭비하는 코드를 작성 해버렸습니다.
평소 보다 배수로 뛴 API 요금에 기겁하고 디버깅한 결과 원인을 발견, Fix(savePicture) 커밋까지.. 해결 했습니다.
분명 유저의 사진저장 인터랙션이 진행되고 3초후 onSavePicture의 호출횟수를 테스트 했다면, 빠른 발견이 가능 했을겁니다.

## 클라이언트 관점

### 클라이언트는 기술을 가진 회사를 신뢰합니다.
- 규모가 큰 회사 일수록 더욱 중요시 생각하는 __소프트웨어 테스트 자동화__ 기술은 소유한 업체에 대하여 각종 포트폴리오, 디자인등 문서에 더하여 큰 선정 고려요소이자, 신뢰를 제공 할 수 있는 대표적인 방법 중 하나입니다.

### 클라이언트는 산출물이 필요합니다.
- 개발업체를 선정하는 부분에 있어, 업체 별 산출물의 정리과정중 __소프트웨어 테스트__ 관련 문서는 고려대상이 아닐 수 없습니다.
클라이언트 입장에서, 테스트를 전적으로 우리회사에게 맡기는 경우는 거의 존재하지 않습니다.
각 회사는 개발팀부터 QA팀, PM, PL까지 많은 인력 소모를 감수하여, 매 배포시 테스트를 진행합니다.
우리는 __playwright__ 의 __reporter__ 의 기능은 다음과 같습니다. 
- HTML
  - 파일(페이지) - 테스트 그룹 - 테스트 케이스로 분류된 목록
  - pass/fail/skip 필터링
  - 검색
- Screenshot
  - 테스트 코드중 설정에 따라 programmatic 또는 자동 으로 테스트 장면을 저장 가능
- JSON/Custom Reporter
  - 엑셀 라이브러리를 이용하여, 커스텀한 엑셀을 생성 및 제공 할 수 있습니다.
  - 그 외 고객의 요구사항에 맞게 커스터마이징한 Reporter 를 제공 할 수 있습니다.

### 결국 신뢰를 얻습니다.
**처음** 파트너쉽을 맺은 경우, 신중한 클라이언트들은 테스트의 결과를 믿지 못할 수 있습니다.
지속적인 검증을 통해 점차 테스트 결과서를 **신뢰하고**, 신뢰된 산출물을 바탕으로 소통 할 수 있다는 것은
- 커뮤니케이션 입장에서 매우 **효율적이고 안정적인 업무**가 가능합니다.
- 장기적인 파트너쉽 유지에 도움이 됩니다.


## 그래서 왜 Playwright?
먼저 vitest, vue3는 unit, component 공식 unit/component 테스트 라이브러리로 vitest를 사용하고 있습니다 하지만
vite, vue 모두 SPC 를 위한 툴이며, vitest는 SPC, Client-Side Rendering 가 아닌 환경에서는 component 테스팅조차 의도대로 동작하지 않습니다.  

이에 nuxt는 nuxt/test-utils 특히 vue는 playwright 전 cypress에 대한 복잡한 세팅과정을 CLI 사전 세팅을 통해 해결하려 했지만 라이브러리 자체의 문제인 진입장벽, 개발비용, 복잡한 셋업 과정을 커버 할 순 없었습니다. 

그동안 e2e 테스트는 unit test 보다 앱에대한 자신감을 가질 수 있지만, 
훨씬 더 요구되는 개발비용으로 인해 도입이 어려웠었던 것이 현실입니다.
이에 마이크로소프트의  __Playwright__ 는 위 문제들에 대한 대안을 제시합니다.
# 5. Refer
- https://docs.cypress.io/guides/core-concepts/testing-types
- https://playwright.dev/docs/intro
- https://doong-jo.github.io/posts/front-end_testing_strategy/
<!-- - https://wiki.abacussw.co.kr/ko/technote/frontend/javascript/vue-library/full-calendar -->