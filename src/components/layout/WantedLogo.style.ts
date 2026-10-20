import { css } from "@wanteddev/wds";

/**
 * 원본 PNG(12977×4189) 안에서 그라디언트 심볼이 차지하는 비율.
 * left 8.346% / top 25.806% / width 22.848% / height 48.389% 를 측정해서
 * 심볼만 보이도록 확대 후 오프셋을 준다.
 */
const IMAGE_ASPECT = 12977 / 4189; // 3.0979
const SYMBOL_ASPECT = 2965 / 2027; // 1.4628
const HEIGHT_SCALE = 1 / 0.48389; // 2.0666 — 심볼 높이를 컨테이너 높이에 맞추는 배율
const WIDTH_SCALE = HEIGHT_SCALE * IMAGE_ASPECT; // 6.4020
const OFFSET_LEFT = 0.08346 * WIDTH_SCALE; // 0.5343
const OFFSET_TOP = 0.25806 * HEIGHT_SCALE; // 0.5333

export const logoRootStyle = css`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  height: var(--logo-h);
  width: calc(var(--logo-h) * ${SYMBOL_ASPECT});

  > img {
    position: absolute;
    height: calc(var(--logo-h) * ${HEIGHT_SCALE});
    width: auto;
    max-width: none;
    left: calc(var(--logo-h) * ${-OFFSET_LEFT});
    top: calc(var(--logo-h) * ${-OFFSET_TOP});
  }
`;
