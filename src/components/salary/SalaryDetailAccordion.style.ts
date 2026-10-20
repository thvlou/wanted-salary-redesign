import { css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

/**
 * "연봉 상세 보기" 라벨의 좌측 시작점을 위쪽 TextField 의 입력 숫자와 맞춘다.
 * TextField 는 박스 좌측에서 12px 지점에 텍스트가 시작하므로,
 * 여기서는 border 1px + INNER_INSET 11px = 12px 가 되도록 root padding 을 0 으로 두고
 * summary/details 에 INNER_INSET 을 직접 준다.
 */
const INNER_INSET = 11;

export const detailAccordionStyle = (theme: Theme) => css`
  width: 100%;
  padding: 0;
  border: 1px solid ${theme.semantic.line.solid.normal};
  border-radius: 12px;
  background-color: ${theme.semantic.background.elevated.normal};
`;

export const detailSummaryStyle = css`
  padding-left: ${INNER_INSET}px;
  padding-right: ${INNER_INSET}px;
`;

export const detailContentStyle = css`
  width: 100%;
  padding: 0 ${INNER_INSET}px 12px;
`;

/** AccordionDetails 기본 padding 을 제거해 상세 행도 헤더와 같은 좌측 기준선을 갖게 한다. */
export const detailDetailsResetStyle = css`
  padding: 0;
`;

export const detailRowStyle = css`
  padding: 10px 0;
`;

/** trailingContent 를 직접 구성하므로 chevron 회전도 expanded 상태로 제어한다. */
export const chevronStyle = (expanded: boolean) => (theme: Theme) => css`
  flex-shrink: 0;
  font-size: 20px;
  color: ${theme.semantic.label.alternative};
  transform: rotate(${expanded ? 180 : 0}deg);
  transition: transform 0.2s ease;
`;
