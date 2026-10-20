import { css } from "@wanteddev/wds";

import { PAGE_MAX_WIDTH, focusRingStyle } from "../salary/shared.style";

import type { Theme } from "@wanteddev/wds";

export const footerRootStyle = (theme: Theme) => css`
  margin-top: 80px;
  border-top: 1px solid ${theme.semantic.line.solid.normal};
  background-color: ${theme.semantic.background.normal.alternative};
`;

export const footerInnerStyle = css`
  width: 100%;
  max-width: ${PAGE_MAX_WIDTH}px;
  margin: 0 auto;
  padding: 32px 24px 48px;
`;

export const footerTopStyle = css`
  flex-wrap: wrap;
`;

export const footerLinkStyle = (theme: Theme) => css`
  color: ${theme.semantic.label.neutral};
  white-space: nowrap;

  &:hover {
    color: ${theme.semantic.label.normal};
    text-decoration: underline;
  }

  ${focusRingStyle(theme)}
`;

export const footerMetaRowStyle = css`
  flex-wrap: wrap;
  row-gap: 4px;
`;

export const socialIconStyle = (theme: Theme) => css`
  display: inline-flex;
  color: ${theme.semantic.label.assistive};
  font-size: 20px;

  &:hover {
    color: ${theme.semantic.label.neutral};
  }

  ${focusRingStyle(theme)}
`;

export const footerLogoStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.semantic.label.neutral};
`;
