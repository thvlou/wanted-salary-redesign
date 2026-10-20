import { css } from "@wanteddev/wds";

import { focusRingStyle } from "./shared.style";

import type { Theme } from "@wanteddev/wds";

export const positionsBodyStyle = css`
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const criteriaColumnStyle = css`
  flex: 0 0 172px;
  min-width: 160px;
`;

export const positionsGridStyle = css`
  flex: 1 1 640px;
  min-width: 300px;
`;

export const positionCardStyle = (theme: Theme) => css`
  height: 100%;
  border: 1px solid ${theme.semantic.line.solid.normal};
  border-radius: 14px;
  overflow: hidden;
  background-color: ${theme.semantic.background.elevated.normal};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${theme.semantic.line.primary.strong};
    box-shadow: ${theme.semantic.elevation.shadow.normal.medium};
    transform: translateY(-2px);
  }

  ${focusRingStyle(theme)}
`;

/**
 * 16/9 썸네일 영역. 이미지 로딩 전·실패 시에는 브랜드 컬러 그라디언트가 보인다.
 * 이미지는 비율을 유지한 채 영역을 채우도록 cover 로 깔린다.
 */
export const positionThumbStyle = css`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand) 22%, white),
    color-mix(in srgb, var(--brand) 6%, white)
  );

  > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;

export const positionLogoStyle = (theme: Theme) => css`
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: ${theme.semantic.static.white};
  box-shadow: ${theme.semantic.elevation.shadow.normal.xsmall};
  color: var(--brand);
`;

export const positionContentStyle = css`
  padding: 16px;
`;
