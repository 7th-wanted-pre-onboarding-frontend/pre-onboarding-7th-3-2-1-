# 원티드 프리온보딩 3-2 1팀

# 팀 소개

| 이름         | github                         |
| ------------ | ------------------------------ |
| 박승민(팀장) | https://github.com/pmb087      |
| 김정현       | https://github.com/task11      |
| 김준호       | https://github.com/kimjuno97   |
| 윤태성       | https://github.com/taesung1993 |
| 임형섭       | https://github.com/4hsnim      |
| 조서연       | https://github.com/sycho09     |

# 기술 스택

<img src="https://img.shields.io/badge/javascript_ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/next.js-61DAFB?style=for-the-badge&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/material_ui-DB7093?style=for-the-badge&logo=material-ui&logoColor=white">
<img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">

# 실행 방법

1. 프로젝트 관련 라이브러리를 설치합니다.

```bash
npm install
```

2. 프로젝트를 실행합니다.

```bash
npm run dev
```

3. [서버 Repo](https://github.com/7th-wanted-pre-onboarding-frontend/pre-onboarding-7th-3-2-1--server)를 클론받습니다.
```bash
git clone https://github.com/7th-wanted-pre-onboarding-frontend/pre-onboarding-7th-3-2-1--server.git
```

4. 같은 방식으로 `API` 프로젝트 관련 라이브러리를 설치합니다.

```bash
npm install
```

5. `API` 프로젝트를 실행합니다.

```bash
npm run gen  
npm run start 
```

# 인증로직
- 인증 로직은 크게 로그인, 자동 로그인, 자동 로그아웃으로 이루어져 있습니다.

### 회원가입과 로그인을 하나로 합친 로그인 프로세스
<p align="center">
  <img width="729" alt="스크린샷 2022-11-17 22 06 28" src="https://user-images.githubusercontent.com/58736618/202454412-9d66703f-3c47-41ba-adec-e1d77aec240b.png">
</p>

- 위 그림은 로그인 순서도 입니다.
- 로그인을 할 경우, 로그인 API 말고 회원가입 API으로 요청을 날려서 진행하라는 말을 들었지만, 회원가입 하나만으로는 아이디 중복문제가 있기 때문에 로그인 기능을 대체할 수는 없었습니다.
- 그래서 Next.js의 엔드포인트를 이용하여 **/api/login** 라는 커스텀 API를 만들어서, 먼저 회원가입 요청을 날리고, 중복 에러가 발생하면 이를 캐치하여 로그인 요청을 다시 날려서 로그인과 회원가입을 하나의 기능으로 합쳤습니다.
- 로그인이 성공하면, [XSS 공격](https://namu.wiki/w/XSS)으로 인한 쿠키 탈취 문제를 방지하고자 Http 쿠키에 AccessToken을 만료시간(1시간)에 맞게 저장하였습니다.
- 또한, 자동 로그인 구현을 위해 ExpiredTime을 쿠키에 저장하였고, userId(데이터 베이스 상 내 계정의 아이디 값)을 로컬 스토리지에 저장하였습니다.
<br/>

### RouterGuard 컴포넌트를 이용한 자동 로그인 기능
<p align="center">
  <img width="1077" alt="스크린샷 2022-11-17 22 35 22" src="https://user-images.githubusercontent.com/58736618/202460393-7502f78d-4e3d-416b-8716-b2fb5e226813.png">
</p>

- 위 그림은 자동 로그인 순서도 입니다.
- 유저가 /login을 제외한 모든 경로에 접속을 했을 경우, RouterGuard 컴포넌트에서 로컬스토리지에서 userId가 있는지 체킹합니다.  
- 그리고 최초 로드이기 때문에 유저에 대한 정보는 리덕스에 저장되어있지 않을 것입니다. 그래서 리덕스에 **userState**가 저장되어 있는지 체킹합니다.

```javascript
    const isUserIdInLocal = LocalService.has('userId');
    const isUserState = !!userState;
    const wasLogged = !isUserState && isUserIdInLocal;

    if (wasLogged) {
      setUserMeToStore();
      AuthService.autoSignOut(router);
    }
```
- 위 조건을 만족하면, **/api/users/:userId** 패스로 API를 보냅니다. 그리고 토큰을 체킹한 후, 토큰이 있으면 **localhost:4000/users/:userId**로 요청을 보내서 로그인한 유저의 정보를 받아 리덕스에 상태를 저장합니다.
- 그리고 expiredTime을 체킹하여, 현재 시간과의 차이를 계산하여, 계산 한 값만큼 타이머를 걸어, 그 시간이 지나면 자동 로그아웃을 할 수 있도록 처리를 합니다.

### 로그인 페이지에서의 userId와 유저 상태 값 초기화
```javascript
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.user);

  useEffect(() => {
    if (state) {
      dispatch(setUser(null));
    }

    CookieService.remove('expiredDate');
    LocalService.remove('userId');
  }, []);
```
- 위 코드를 **Login.tsx**의 코드 중 일부입니다. Http 쿠키에 저장된 accessToken 값은 **Next.js 미들웨어**에서 체킹하기 때문에 토큰이 만료되어 사려졌을 경우에는 자동적으로 **/login** 페이지로 리다이렉트처리가 되도록 설정을 해놓았습니다. 하지만, 이게 끝은 아닙니다.
- 분명히 localStorage에 userId가 남아있을 것이고, 쿠키에는 expiredTime 데터가 남아있을 것이고, 전역 상태에 user값이 남아 있을 수 있습니다. 따라서 이를 지워주는 작업을 해주어야 비로소 로그아웃처리가 완료됐다고 말씀드릴 수 있습니다.

# 계좌 목록 가져오기
- 계좌 목록의 요구사항은 다음과 같습니다.
  - 고객명(user_name) : 고객ID 를 참조하여 실제 이름으로 보여져야 합니다.
  - 고객명을 누를 경우 사용자 상세화면으로 이동합니다.
  - 브로커명(broker_name) : 예시) OO증권, `brokers.json` 를 참조하여 실제 이름으로 보여져야 합니다.
  - 계좌번호(number) : 앞 뒤 각각 두글자를 제외하고 나머지는 글자수에 맞게 `*` 글자로 마스킹 처리가 필요합니다.
  - 계좌상태(status) : 예시) 운용중, `accountStatus.json` 를 참조하여 실제 이름으로 보여져야 합니다.
  - 계좌명(name) : 계좌명입니다.
  - 평가금액(assets) : 예시) 123,123,123
  - 입금금액(payments) : 예시) 123,123,123
  - 계좌활성화여부(is_active) : 계좌 활성화 여부
  - 계좌개설일(created_at)
- 나머지 정보는 **localhost:4000/accounts**을 Get요청을 보내면 받을 수 있지만, **고객명**의 경우에는 받을 수가 없었습니다. 따라서 앤드포인트 API인 **/api/accounts**를 만들어서 두 API를 **Promise.all** 함수를 이용하여 한번에 불러와서 조합하는 형태로 코드를 작성하였습니다.
```javascript
const promises = [
      request.get<IUser[]>('http://localhost:4000/users', {
        headers: {
          Authorization: token.replace('token=', 'Bearer ')
        }
      }),
      request.get<IAccount[]>('http://localhost:4000/accounts', {
        headers: {
          Authorization: token.replace('token=', 'Bearer ')
        },
        params: {
          _limit: LIMIT,
          _page: req.query.page,
          q: req.query.keyword,
          broker_id: req.query.broker_id,
          is_active: req.query.is_active,
          status: req.query.status
        }
      })
    ];
const [usersResponse, accountsResponse] = await Promise.all(promises); // 두 응답을 조합하여 위 요구사항을 만족할 수 있게 코드를 작성하였음.
```

# 사용자 목록 가져오기
- 위 내용과 같습니다. **localhost:4000/accounts**, **localhost:4000/users**, **localhost:4000/userSetting** 세 개를 조합한 엔드포인트 **/api/users** 사용자 리스트에 필요한 데이터를 합성시켜서 브라우저로 전달하였습니다.
```javascript
const users = await request.get<IUser[]>(`http://localhost:4000/users`, {
    headers: {
      Authorization: token.replace('token=', 'Bearer ')
    },
    params: {
      _limit: LIMIT,
      _page: req.query.page,
      q: req.query.keyword
    }
  });

  const userIds = users.data.map((user) => ({
    uuid: user.uuid,
    id: user.id
  }));

  const acccountsPromises = userIds.map(({ id }) =>
    request.get<IAccount[]>('http://localhost:4000/accounts', {
      params: {
        user_id: id
      },
      headers: {
        Authorization: token.replace('token=', 'Bearer ')
      }
    })
  );

  const settingsPromises = userIds.map(({ uuid }) =>
    request.get<IUserSetting[]>('http://localhost:4000/userSetting', {
      params: {
        uuid: uuid
      },
      headers: {
        Authorization: token.replace('token=', 'Bearer ')
      }
    })
  );
```
