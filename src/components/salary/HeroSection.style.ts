import { css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

export const heroTopSpacingStyle = css`
  margin-top: 40px;
`;

export const filterRowStyle = css`
  flex-wrap: wrap;
`;

/**
 * 좌: 연봉 요약 / 우: 연차별 차트.
 * align-items: start 로 두 컬럼 상단을 맞추고, 높이는 콘텐츠가 결정하게 둔다.
 * (고정 height·min-height·space-between 을 쓰지 않는 이유)
 */
/**
 * 데스크톱 배치(좌측 300px / 우측 차트):
 *   [요약]  [차트]   ← row 1 (1fr: 남는 높이를 흡수)
 *   [메타]  [  ↑  ]  ← row 2 (차트가 두 행을 span)
 * 메타가 grid 직계 자식이므로 1열로 접힐 때는 DOM 순서
 * (요약 → 차트 → 메타)가 그대로 유지된다.
 */
export const heroGridStyle = css`
  display: grid;
  grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
  /*
   * 두 행 모두 auto: 좌측이 자연 높이로 쌓이므로 trend→meta 간격이
   * row-gap(32px) 그대로 유지된다. ("세전 연봉 기준"→trend 간격과 동일)
   */
  grid-template-rows: auto auto;
  column-gap: 40px;
  row-gap: 32px;
  align-items: start;
  margin-top: 32px;

  /* WDS md 브레이크포인트(992px)와 맞춰 금액 타이포 단계와 함께 전환된다. */
  @media (max-width: 991px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
  }
`;

export const heroSummaryCellStyle = css`
  grid-column: 1;
  grid-row: 1;

  @media (max-width: 991px) {
    grid-column: auto;
    grid-row: auto;
  }
`;

export const heroChartCellStyle = css`
  grid-column: 2;
  grid-row: 1 / span 2;
  min-width: 0;

  @media (max-width: 991px) {
    grid-column: auto;
    grid-row: auto;
  }
`;

export const heroMetaCellStyle = css`
  grid-column: 1;
  grid-row: 2;

  @media (max-width: 991px) {
    grid-column: auto;
    grid-row: auto;
  }
`;

export const heroSummaryStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;


/** 긴 직무명은 두 줄까지만 허용해 금액이 밀려나지 않게 한다. */
export const heroTitleStyle = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/*
 * 좌측 컬럼(320px)보다 긴 "1억 2,000만원"(56px 기준 약 352px)은 잘리거나 축소되는
 * 대신 "1억" 뒤 공백에서만 줄바꿈된다. keep-all 로 "1,000만원" 내부는 쪼개지지 않는다.
 */
export const heroAmountStyle = css`
  margin-top: 12px;
  word-break: keep-all;
  /*
   * display1 의 기본 line-height(72px)는 56px 글자 대비 여백이 커서
   * 제목과의 간격이 실제보다 넓어 보인다. md 이상에서 적용되는
   * 반응형 variant 규칙을 이기려면 같은 미디어쿼리 안에서도 선언해야 한다.
   */
  line-height: 1.1;

  @media (min-width: 992px) {
    line-height: 1.1;
  }
`;

export const heroBaseNoteStyle = css`
  margin-top: 8px;
`;

/** 직전 연차 대비 정보. Hero 전체보다 낮은 위계의 neutral surface. */
export const trendSurfaceStyle = (theme: Theme) => css`
  align-self: stretch;
  margin-top: 32px;
  padding: 16px;
  border-radius: 14px;
  background-color: ${theme.semantic.background.normal.alternative};
  border: 1px solid ${theme.semantic.line.solid.normal};
`;

export const trendIconStyle = (positive: boolean) => (theme: Theme) => css`
  flex-shrink: 0;
  font-size: 18px;
  color: ${positive
    ? theme.semantic.primary.normal
    : theme.semantic.status.negative};
`;
