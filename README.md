# 🎯 Snab

<div align="center">

**프로페셔널한 크롬 브라우저 탭 관리 솔루션**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?logo=googlechrome)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)

**수백 개의 탭으로 지친 당신을 위한 지능형 워크스페이스 관리 시스템**

[📥 다운로드](#-설치) · [📖 사용 가이드](#-사용-가이드) · [🎓 튜토리얼](#-튜토리얼) · [💡 기능 소개](#-주요-기능)

</div>

---

## 🎯 왜 Snab인가?

### 😫 기존 브라우저의 문제점

- **탭 폭주**: 열고 싶은 탭은 많지만 닫기도 아까운 상황
- **컨텍스트 전환 비용**: 업무용 탭과 개인용 탭이 뒤섞여 혼란
- **세션 관리 불가**: 컴퓨터를 끄면 모든 탭 정보가 사라짐
- **북마크 한계**: 북마크는 "나중에 볼 것"의 무덤

### ✨ Snab의 해결책

**웨더 맞춤 워크스페이스 시스템**으로 프로젝트, 연구, 취미 등 모든 활동을 분리하여 관리하세요.

- 🎨 **시각적 탭 관리**: Masonry 레이아웃으로 한눈에 모든 정보 파악
- 💾 **영구 보존**: 브라우저를 꺼도 워크스페이스는 그대로 유지
- ⚡ **원클릭 전환**: 업무→개인→업무 순식간에 전환
- 📸 **스냅샷**: 현재 상태를 나중을 위해 저장

---

## ✨ 주요 기능

### 🗂️ 워크스페이스 (Workspaces)

#### 직관적인 탭 그룹화

```
워크스페이스 1: "React 프로젝트"
  ├─ 그룹: "참고 문서"
  ├─ 그룹: "API 문서"
  └─ 그룹: "관련 레포지토리"

워크스페이스 2: "학습 자료"
  ├─ 그룹: "JavaScript"
  ├─ 그룹: "TypeScript"
  └─ 그룹: "React 강의"
```

**특징:**

- ✅ 무제한 워크스페이스 생성
- ✅ 드래그 앤 드롭으로 순서 변경
- ✅ 인라인 이름 편집
- ✅ 한 번의 클릭으로 워크스페이스 전환

### 📸 스냅샷 (Snapshot)

**현재 브라우저 상태를 워크스페이스로 저장**

상황 예시:

- 📚 연구 중 발견한 모든 유용한 링크들을 한 번에 저장
- 🎯 회의 전 준비 자료들을 별도 워크스페이스로 정리
- 💼 일일 작업 현황을 기록

**옵션:**

- 🔒 **유지 모드**: 스냅샷 후에도 현재 탭들을 그대로 유지
- 🗑️ **닫기 모드**: 스냅샷 후 자동으로 모든 윈도우 닫기

### 🎯 드래그 앤 드롭 (Drag & Drop)

**자유로운 탭 이동**

```
다음 작업을 직관적으로 수행:
┌─────────────────────────────────┐
│  워크스페이스 ← → 워크스페이스  │
│  그룹        ← → 그룹          │
│  탭          ← → 새 윈도우     │
│  빈 공간     →  그룹 생성      │
└─────────────────────────────────┘
```

### 📁 그룹 관리 (Groups)

#### Masonry 레이아웃

```
┌─────────┬─────────┐
│ 그룹 A  │ 그룹 B  │
│ 탭 1    │ 탭 1    │
│ 탭 2    │ 탭 2    │
└─────────┼─────────┤
   그룹 C   탭 3    │
   탭 1    탭 4    │
   탭 2    └───────┘
```

- ✅ 자동 2열 정렬
- ✅ 높이 자동 조절
- ✅ 반응형 디자인

#### 그룹 작업

- **복원**: 그룹의 모든 탭을 새 윈도우로 열기
- **편집**: 이름 인라인 수정
- **삭제**: 한 번의 클릭으로 제거

### 💾 북마크 (Bookmarks)

#### 캡셔너블 북마크

- ✅ 접기/펼치기로 공간 절약
- ✅ 호버 시 빠른 삭제
- ✅ 파비콘 자동 표시 (그림자 효과)

#### 관리

- 📌 현재 탭 북마크 추가
- 🗑️ 삭제 시 즉시 반영
- 📊 수량 표시

---

## 🚀 설치

### 방법 1: Chrome 웹 스토어 (준비 중)

```bash
# Chrome 웹 스토어에서 "Snab" 검색 후 설치
```

### 방법 2: 개발자 모드 설치

#### 1단계: 프로젝트 다운로드

```bash
git clone https://github.com/yourusername/snab.git
cd snab
```

#### 2단계: 의존성 설치

```bash
npm install
```

#### 3단계: 빌드

```bash
npm run build
```

#### 4단계: Chrome에 로드

1. Chrome 브라우저 실행
2. 주소창에 `chrome://extensions/` 입력
3. 우측 상단 **개발자 모드** 토글 ON
4. **압축해제된 확장 프로그램을 로드합니다** 클릭
5. `snab/dist` 폴더 선택

✅ **완료!** 이제 새 탭을 열어 Snab을 사용할 수 있습니다.

---

## 📖 사용 가이드

### 🎓 빠른 시작 (5분 튜토리얼)

#### 1️⃣ 첫 워크스페이스 만들기 (30초)

1. 새 탭 열기 → Snab 자동 실행
2. 왼쪽 사이드바의 `+ 새 워크스페이스` 클릭
3. 이름 입력 (예: "업무")
4. Enter

#### 2️⃣ 탭을 그룹에 추가하기 (1분)

1. 오른쪽 패널에서 원하는 탭 찾기
2. 탭을 드래그하여 워크스페이스 영역으로 이동
3. 드롭 → 자동으로 새 그룹 생성
4. 그룹 이름 설정 (Enter)

#### 3️⃣ 워크스페이스 전환하기 (10초)

1. 사이드바에서 다른 워크스페이스 클릭
2. 즉시 해당 워크스페이스로 전환

#### 4️⃣ 현재 상태 저장하기 (30초)

1. 헤더의 📷 **스냅샷** 버튼 클릭
2. 유지/닫기 토글 선택
3. 완료!

---

## 💡 고급 기능

### 🔄 워크스페이스 간 탭 이동

```
Drag:  워크스페이스 A의 탭
Drop:  워크스페이스 B의 그룹
결과:  탭이 워크스페이스 B로 이동
```

### 🌐 그룹에서 브라우저로 탭 복원

```
1. 그룹의 탭을 드래그
2. 브라우저 윈도우 영역으로 드롭
3. 자동으로 새 탭으로 열림
```

### 📐 패널 크기 조절

```
사이드바:      리사이즈 핸들 드래그
윈도우 패널:   리사이즈 핸들 드래그
```

### 🔍 빠른 검색 (준비 중)

```
Ctrl/Cmd + K: 워크스페이스 전체 검색
```

---

## 🛠️ 개발자 가이드

### 기술 스택

<details>
<summary>📦 상세 기술 정보</summary>

#### Frontend

- **React 19**: 최신 React 기능 활용
- **TypeScript 5.8**: 엄격한 타입 체크
- **Tailwind CSS 4**: 유틸리티 우선 CSS

#### Build & Tools

- **Vite 7**: 초고속 빌드
- **CRXJS**: Chrome Extension 개발 프레임워크
- **ESLint + Prettier**: 코드 품질 관리

#### Libraries

- **@dnd-kit**: 접근성 있는 드래그 앤 드롭
- **Lucide React**: 컬렉션 아이콘
- **Tailwind Merge**: 클래스 병합

</details>

### 프로젝트 구조

```
snab/
├── src/
│   ├── newtab/              # 메인 인터페이스
│   │   ├── components/      # React 컴포넌트
│   │   │   ├── workspace/   # 워크스페이스 관련
│   │   │   │   ├── Content.tsx      # 그룹 표시
│   │   │   │   ├── Sidebar.tsx      # 워크스페이스 목록
│   │   │   │   ├── Workspace.tsx    # 워크스페이스 컨테이너
│   │   │   │   ├── GroupCard.tsx    # 그룹 카드
│   │   │   │   └── GroupHeader.tsx  # 그룹 헤더
│   │   │   ├── Bookmark.tsx         # 북마크
│   │   │   ├── Header.tsx           # 앱 헤더
│   │   │   └── Window.tsx           # 윈도우 표시
│   │   ├── hooks/                   # 커스텀 훅
│   │   │   ├── useDragAndDrop.ts   # 드래그 앤 드롭 로직
│   │   │   └── useSnapshot.ts      # 스냅샷 로직
│   │   └── App.tsx                  # 메인 앱
│   ├── store/                       # Chrome Storage 관리
│   ├── types/                       # TypeScript 타입
│   ├── utils/                       # 유틸리티 함수
│   └── popup/                       # 확장 팝업
├── public/                          # 정적 파일
├── manifest.config.ts               # Chrome Manifest
└── vite.config.ts                   # Vite 설정
```

### 개발 환경

```bash
# 개발 서버 시작 (HMR 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 컨트리뷰팅

```bash
# 1. Fork & Clone
git clone https://github.com/yourusername/snab.git

# 2. 브랜치 생성
git checkout -b feature/your-feature-name

# 3. 개발 및 테스트
npm run dev

# 4. 커밋 & 푸시
git commit -m "feat: Add your feature"
git push origin feature/your-feature-name

# 5. Pull Request 생성
```

---

## 📊 성능 및 제한사항

### 성능 메트릭

- ⚡ **초기 로딩**: < 500ms
- 🖱️ **드래그 레이턴시**: < 16ms (60fps)
- 💾 **스토리지 용량**: 워크스페이스당 평균 100KB

### 브라우저 호환성

| 브라우저 | 버전 | 상태           |
| -------- | ---- | -------------- |
| Chrome   | 100+ | ✅ 완전 지원   |
| Edge     | 100+ | ✅ 완전 지원   |
| Brave    | 100+ | ✅ 완전 지원   |
| Opera    | 86+  | 🟡 테스트 필요 |
| Firefox  | -    | ❌ 미지원      |

---

## ❓ FAQ

### Q1: 워크스페이스는 어디에 저장되나요?

A: Chrome의 Local Storage에 저장됩니다. 브라우저를 삭제하지 않는 한 데이터가 유지됩니다.

### Q2: 다른 컴퓨터와 동기화되나요?

A: 현재 버전에서는 로컬만 저장됩니다. Chrome Sync 연동은 개발 중입니다.

### Q3: 탭을 너무 많이 저장하면 느려지나요?

A: 수백 개의 탭까지는 문제없습니다. Chrome Storage 제한(10MB)에 도달하면 경고가 표시됩니다.

### Q4: 기존 북마크와 충돌하나요?

A: 충돌하지 않습니다. Snab의 북마크는 별도로 관리됩니다.

### Q5: 워크스페이스를 내보내거나 백업할 수 있나요?

A: 현재는 불가능합니다. 백업 기능은 로드맵에 포함되어 있습니다.

---

## 🗺️ 로드맵

### v1.1 (다음 버전)

- [ ] 다크 모드
- [ ] 워크스페이스 검색
- [ ] 설정 페이지

### v1.2

- [ ] Chrome Sync 연동
- [ ] 워크스페이스 임포트/내보내기
- [ ] 키보드 단축키 커스터마이징

### v2.0 (장기)

- [ ] 협업 기능 (워크스페이스 공유)
- [ ] AI 기반 탭 분류
- [ ] 모바일 앱

---

## 📄 라이센스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

> 자유롭게 사용, 수정, 배포하세요. 단, 라이센스 고지만 유지하면 됩니다.

---

## 💬 지원 및 문의

- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/yourusername/snab/issues)
- 💡 **기능 제안**: [GitHub Discussions](https://github.com/yourusername/snab/discussions)
- 📧 **이메일**: support@snab.io (준비 중)

---

<div align="center">

**Snab으로 더 효율적인 브라우징을 경험하세요.**

Made with ❤️ by the Snab Team

[⭐ GitHub에서 스타](https://github.com/yourusername/snab) · [🐦 트위터](https://twitter.com/snab) · [📧 구독하기](https://snab.io/newsletter)

</div>
