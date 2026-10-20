import { css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

/**
 * 좌(분포 그래프) : 우(입력·상세) = 6 : 4.
 * 그래프에 가로 여유를 더 주고, 우측은 입력 행과 상세 카드가 깨지지 않는 폭만 남긴다.
 * Hero 와 같은 991px 지점에서 한 열로 전환한다.
 */
export const compareBodyStyle = css`
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 4fr);
  column-gap: 40px;
  row-gap: 32px;
  align-items: start;

  @media (max-width: 991px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const compareChartColumnStyle = css`
  min-width: 0;
`;

export const compareInputColumnStyle = css`
  min-width: 0;
`;

export const resultRowStyle = (theme: Theme) => css`
  padding: 12px 0;

  & + & {
    border-top: 1px solid ${theme.semantic.line.solid.alternative};
  }
`;

export const benchmarkRowStyle = (theme: Theme) => css`
  padding: 12px 16px;
  border-radius: 10px;
  background-color: ${theme.semantic.background.normal.normal};
  border: 1px solid ${theme.semantic.line.solid.normal};
`;
