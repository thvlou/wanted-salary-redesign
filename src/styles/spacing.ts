/**
 * 페이지 여백 규약.
 *
 * Montage 는 `list_tokens` 에서 spacing 스케일
 * (0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80)을 제공하지만
 * "Do not use spacing tokens" 라고 명시한다. 즉 `theme.spacing.*` 를 직접 참조하지 않고
 * 스케일 위의 값을 px 로 쓰는 것이 시스템 의도다.
 *
 * 그래서 아래 값은 전부 Montage 스케일 위의 값만 사용하고,
 * 역할 이름을 붙여 한 곳에서 관리한다. 컴포넌트에 흩어진 매직 넘버 대신 이 상수를 쓴다.
 */
export const SPACING = {
  /** GNB 아래 → 첫 섹션 */
  pageTop: 40,
  /** 섹션 ↔ 섹션 */
  section: 56,
  /** 섹션 제목(헤더 묶음) → 섹션 본문 */
  titleToContent: 32,
  /** 본문 안의 블록 ↔ 블록 (본문 → 후속 CTA 등) */
  block: 24,
  /** 그룹 안 요소 ↔ 요소 */
  group: 16,
  /** 밀접하게 붙는 쌍 (제목-부제, 제목-보조 배지) */
  tight: 8,
  /** 큰 숫자(display)와 바로 위 라벨. 시각적으로 한 덩어리로 읽히게 더 좁게 붙인다. */
  displayPair: 12,
} as const;

/** `margin-top: 32px` 처럼 쓰기 위한 px 문자열 헬퍼. */
export const px = (value: number) => `${value}px`;
