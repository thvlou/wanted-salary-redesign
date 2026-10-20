import { addOpacity, css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

/**
 * 세로 구성(px):
 *   0 ~ PLOT_TOP        결과 말풍선이 들어갈 여유 (정점 기준 카드 높이 ≈ 46 + 12 offset)
 *   PLOT_TOP ~ BASELINE 곡선 영역 (높이 178)
 *   AXIS_Y              축 라벨 baseline (caption1 = 12/16px)
 */
export const VIEW_H = 300;
export const PLOT_TOP = 68;
export const BASELINE = 246;
export const AXIS_Y = 264;
export const PAD_X = 24;

/** ratio(0~1) → 컨테이너 기준 left. plot area 는 좌우 PAD_X 만큼 들어가 있다. */
export const ratioLeft = (ratio: number) =>
  `calc(${PAD_X}px + (100% - ${PAD_X * 2}px) * ${ratio.toFixed(4)})`;

export const chartRootStyle = (theme: Theme) => css`
  --dist-line: ${theme.semantic.primary.normal};
  --dist-fill: ${addOpacity(theme.semantic.primary.normal, theme.opacity[8])};
  --dist-dot: ${theme.semantic.background.normal.normal};
  --dist-dot-border: ${addOpacity(theme.semantic.primary.normal, theme.opacity[43])};
  --dist-marker: ${theme.semantic.primary.normal};
  --dist-baseline: ${theme.semantic.line.normal.alternative};

  position: relative;
  width: 100%;
  height: ${VIEW_H}px;
  touch-action: none;
`;

export const curveBandStyle = css`
  position: absolute;
  left: ${PAD_X}px;
  right: ${PAD_X}px;
  top: ${PLOT_TOP}px;
  height: ${BASELINE - PLOT_TOP}px;
  pointer-events: none;
`;

/** plot area 전체를 덮는 클릭·드래그 영역. */
export const plotHitAreaStyle = css`
  position: absolute;
  left: ${PAD_X}px;
  right: ${PAD_X}px;
  top: 24px;
  height: ${BASELINE - 24}px;
  cursor: pointer;
`;

export const anchorDotStyle = css`
  position: absolute;
  width: 22px;
  height: 22px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  cursor: help;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 8px;
    height: 8px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: var(--dist-dot);
    border: 2px solid var(--dist-dot-border);
  }
`;

export const axisLabelStyle = css`
  position: absolute;
  top: ${AXIS_Y}px;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: none;
`;

export const guideLineStyle = css`
  position: absolute;
  width: 2px;
  transform: translateX(-50%);
  background-color: var(--dist-marker);
  pointer-events: none;
`;

/** 드래그 핸들. hover 시 grab, 드래그 중 grabbing. */
export const markerHandleStyle = (dragging: boolean) => () => css`
  position: absolute;
  width: 26px;
  height: 26px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 0;
  padding: 0;
  background: none;
  cursor: ${dragging ? "grabbing" : "grab"};
  touch-action: none;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${dragging ? "16px" : "13px"};
    height: ${dragging ? "16px" : "13px"};
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: var(--dist-marker);
    box-shadow: 0 0 0 3px var(--dist-dot);
  }

  &:hover::after {
    width: 16px;
    height: 16px;
  }
`;

export const markerHandleFocusStyle = (theme: Theme) => css`
  &:focus-visible {
    outline: 2px solid ${theme.semantic.primary.normal};
    outline-offset: 4px;
  }
`;

export const markerCardStyle = (theme: Theme) => css`
  position: absolute;
  transform: translate(-50%, -100%);
  padding: 6px 12px;
  border-radius: 10px;
  background-color: ${theme.semantic.background.elevated.normal};
  border: 1px solid ${theme.semantic.line.primary.strong};
  white-space: nowrap;
  text-align: center;
  pointer-events: none;
`;
