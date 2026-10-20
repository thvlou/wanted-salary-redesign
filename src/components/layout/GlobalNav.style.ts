import { css } from "@wanteddev/wds";

import { PAGE_MAX_WIDTH, focusRingStyle } from "../salary/shared.style";

import type { Theme } from "@wanteddev/wds";

export const navRootStyle = (theme: Theme) => css`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background-color: ${theme.semantic.background.normal.normal};
  border-bottom: 1px solid ${theme.semantic.line.solid.normal};
`;

export const navInnerStyle = css`
  width: 100%;
  max-width: ${PAGE_MAX_WIDTH}px;
  height: 56px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const logoStyle = (theme: Theme) => css`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.semantic.primary.normal};
  flex-shrink: 0;
  ${focusRingStyle(theme)}
`;

export const navMenuStyle = css`
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const navMenuItemStyle = (active: boolean) => (theme: Theme) => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 2px;
  white-space: nowrap;
  color: ${active ? theme.semantic.label.normal : theme.semantic.label.neutral};
  transition: color 0.12s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background-color: ${active ? theme.semantic.label.normal : "transparent"};
  }

  &:hover {
    color: ${theme.semantic.label.normal};
  }

  ${focusRingStyle(theme)}
`;

export const avatarStyle = (theme: Theme) => css`
  background-color: ${theme.semantic.label.normal};
  color: ${theme.semantic.static.white};
  font-size: 10px;
  font-weight: 600;

  [data-role="avatar-fallback"] {
    display: none;
  }
`;
