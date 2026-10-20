import { css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

/**
 * Hero 좌측 컬럼 최하단에 놓여 차트 하단 축과 시각적으로 맞물린다.
 * 위쪽 간격은 Hero grid 의 row-gap 이 담당하므로 여기서 margin 을 주지 않는다.
 */
export const metaRowStyle = css`
  margin-top: 0;
`;

/** 최소 32×32 클릭 영역을 확보한 정보 아이콘 버튼. 장식 배경은 두지 않는다. */
export const infoTriggerStyle = (theme: Theme) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  color: ${theme.semantic.label.alternative};
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: ${theme.semantic.label.normal};
  }

  &:focus-visible {
    outline: 2px solid ${theme.semantic.primary.normal};
    outline-offset: 2px;
  }
`;

export const methodPopoverStyle = css`
  max-width: 340px;
`;
