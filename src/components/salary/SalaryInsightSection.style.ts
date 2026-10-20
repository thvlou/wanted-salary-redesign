import { addOpacity, css } from "@wanteddev/wds";

import type { Theme } from "@wanteddev/wds";

export const insightSurfaceStyle = (theme: Theme) => css`
  border: 1px solid ${theme.semantic.line.solid.normal};
  border-radius: 16px;
  overflow: hidden;
  flex-wrap: wrap;
`;

export const insightLeadStyle = css`
  flex: 1 1 220px;
  min-width: 200px;
  padding: 24px;
`;

export const insightTiersStyle = css`
  flex: 2 1 420px;
  min-width: 300px;
  padding: 24px 8px;
  flex-wrap: wrap;
`;

export const insightTierStyle = (theme: Theme) => css`
  flex: 1 1 120px;
  min-width: 110px;
  padding: 0 16px;

  & + & {
    border-left: 1px solid ${theme.semantic.line.solid.alternative};
  }
`;

export const insightCtaStyle = (theme: Theme) => css`
  flex: 1 1 240px;
  min-width: 220px;
  padding: 24px;
  background-color: ${addOpacity(
    theme.semantic.primary.normal,
    theme.opacity[5],
  )};
`;
