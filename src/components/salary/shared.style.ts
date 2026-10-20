import { css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

export const PAGE_MAX_WIDTH = 1120;

/** 본문 섹션 공통 컨테이너. GNB·푸터와 같은 축으로 정렬된다. */
export const sectionContainerStyle = css`
  width: 100%;
  max-width: ${PAGE_MAX_WIDTH}px;
  margin: 0 auto;
  padding: 0 24px;
`;

/** 섹션 사이 세로 리듬. 카드 대신 여백으로 섹션을 구분한다. */
export const sectionSpacingStyle = css`
  margin-top: 56px;
`;

/** 정보를 담는 옅은 면. 장식 효과 없이 fill 토큰만 사용한다. */
export const softSurfaceStyle = (theme: Theme) => css`
  background-color: ${theme.semantic.fill.alternative};
  border-radius: 12px;
  padding: 20px;
`;

export const outlinedSurfaceStyle = (theme: Theme) => css`
  background-color: ${theme.semantic.background.elevated.normal};
  border: 1px solid ${theme.semantic.line.solid.normal};
  border-radius: 12px;
  padding: 20px;
`;

/**
 * 직접 스타일링한 인터랙티브 요소용 공통 focus ring.
 * (WDS 컴포넌트는 자체 focus 스타일을 갖지만, 커스텀 링크·카드·차트 슬롯은 없다.)
 */
export const focusRingStyle = (theme: Theme) => css`
  &:focus-visible {
    outline: 2px solid ${theme.semantic.primary.normal};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const infoIconStyle = (theme: Theme) => css`
  color: ${theme.semantic.label.assistive};
  font-size: 16px;
  cursor: pointer;
`;
