import { addOpacity, css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

const Y_AXIS_WIDTH = 46;
/**
 * 차트 전체 높이 = 범례(16) + 12 + PLOT_HEIGHT + 10 + 축 라벨(16) = PLOT_HEIGHT + 54.
 * 좌측 컬럼의 자연 높이(요약 242 + row-gap 32 + 메타 32 = 306)와 맞물리도록 252 로 둔다.
 */
export const PLOT_HEIGHT = 252;

export const chartRootStyle = (theme: Theme) => css`
  --bar-active: ${theme.semantic.primary.normal};
  --bar-idle: ${addOpacity(theme.semantic.primary.normal, theme.opacity[28])};
  --range-active: ${addOpacity(theme.semantic.primary.normal, theme.opacity[16])};
  --range-idle: ${addOpacity(theme.semantic.primary.normal, theme.opacity[8])};
  --grid-line: ${theme.semantic.line.normal.alternative};

  width: 100%;
`;

/** y축 라벨 자리를 왼쪽에 비워두고 그 오른쪽이 실제 플롯 영역이 된다. */
export const plotRowStyle = css`
  position: relative;
  padding-left: ${Y_AXIS_WIDTH}px;
`;

export const plotAreaStyle = css`
  position: relative;
  height: ${PLOT_HEIGHT}px;
`;

export const gridLineStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--grid-line);
`;

export const yAxisLabelStyle = css`
  position: absolute;
  right: calc(100% + 10px);
  transform: translateY(-50%);
  white-space: nowrap;
`;

export const barsRowStyle = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
`;

/** tabIndex=0 으로 탭 순서에 들어가므로 키보드 포커스 표시가 필요하다. */
export const barSlotStyle = (theme: Theme) => css`
  position: relative;
  flex: 1;
  height: 100%;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.semantic.primary.normal};
    outline-offset: -2px;
    border-radius: 6px;
  }
`;

/** 25~75% 구간. 중앙값 막대보다 항상 옅게 깔린다. */
export const rangeBandStyle = (active: boolean) => () => css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: min(62%, 46px);
  border-radius: 4px;
  background-color: ${active ? "var(--range-active)" : "var(--range-idle)"};
`;

export const medianBarStyle = (active: boolean) => () => css`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(30%, 20px);
  border-radius: 3px 3px 0 0;
  background-color: ${active ? "var(--bar-active)" : "var(--bar-idle)"};
  transition: background-color 0.12s ease;
`;

export const xAxisRowStyle = css`
  display: flex;
  margin-top: 10px;
  padding-left: ${Y_AXIS_WIDTH}px;
`;

export const xAxisLabelStyle = css`
  flex: 1;
  text-align: center;
`;

/** 포인터를 따라다니는 커스텀 tooltip. 위치 계산을 위해 pointer-events 는 끈다. */
export const pointerTooltipStyle = (theme: Theme) => css`
  position: absolute;
  z-index: 2;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: ${theme.semantic.inverse.background};
  pointer-events: none;
  white-space: nowrap;
`;

export const legendDotStyle = (variant: "median" | "range") => (theme: Theme) => css`
  width: ${variant === "median" ? "10px" : "10px"};
  height: ${variant === "median" ? "10px" : "10px"};
  border-radius: ${variant === "median" ? "2px" : "3px"};
  background-color: ${variant === "median"
    ? theme.semantic.primary.normal
    : addOpacity(theme.semantic.primary.normal, theme.opacity[22])};
`;
