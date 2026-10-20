import { Box, FlexBox, Typography } from "@wanteddev/wds";

import { logoRootStyle } from "./WantedLogo.style";

import type { ThemeColorsToken } from "@wanteddev/wds";
import type { CSSProperties } from "react";

interface WantedLogoProps {
  /** 심볼 마크의 높이(px). */
  height: number;
  textColor?: ThemeColorsToken;
  textVariant?: "headline2" | "body1";
}

/**
 * public/wantedlogo.png 는 심볼 + 흰색 워드마크가 넓은 여백과 함께 들어있는 원본이다.
 * 흰 배경에서는 워드마크가 보이지 않으므로 심볼 영역만 CSS로 잘라 쓰고
 * "wanted" 글자는 테마 색상 텍스트로 렌더링한다.
 */
export function WantedLogo({
  height,
  textColor = "semantic.label.normal",
  textVariant = "headline2",
}: WantedLogoProps) {
  return (
    <FlexBox alignItems="center" gap="7px">
      <Box
        sx={logoRootStyle}
        style={{ "--logo-h": `${height}px` } as CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wantedlogo.png" alt="" />
      </Box>
      <Typography variant={textVariant} weight="bold" color={textColor}>
        wanted
      </Typography>
    </FlexBox>
  );
}
