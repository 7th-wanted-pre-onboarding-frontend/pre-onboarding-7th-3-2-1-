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

