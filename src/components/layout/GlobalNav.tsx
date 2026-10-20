"use client";

import {
  Avatar,
  AvatarButton,
  Box,
  Button,
  FlexBox,
  IconButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";

import { WantedLogo } from "./WantedLogo";
import {
  avatarStyle,
  logoStyle,
  navInnerStyle,
  navMenuItemStyle,
  navMenuStyle,
  navRootStyle,
} from "./GlobalNav.style";

const MENUS = [
  { label: "채용", active: true },
  { label: "이력서", active: false },
  { label: "교육·이벤트", active: false },
  { label: "콘텐츠", active: false },
  { label: "소셜", active: false },
  { label: "프리랜서", active: false },
  { label: "더보기", active: false },
];

export function GlobalNav() {
  return (
    <Box as="header" sx={navRootStyle}>
      <FlexBox
        as="nav"
        alignItems="center"
        justifyContent="space-between"
        gap="24px"
        sx={navInnerStyle}
      >
        <FlexBox alignItems="center" gap="28px" sx={{ minWidth: 0 }}>
          <Box as="a" href="#" aria-label="원티드 홈" sx={logoStyle}>
            <WantedLogo height={20} />
          </Box>

          <FlexBox as="ul" alignItems="center" gap="22px" sx={navMenuStyle}>
            {MENUS.map((menu) => (
              <Box as="li" key={menu.label}>
                <Typography
                  as="a"
                  href="#"
                  variant="body2"
                  weight={menu.active ? "bold" : "medium"}
                  sx={navMenuItemStyle(menu.active)}
                >
                  {menu.label}
                </Typography>
              </Box>
            ))}
          </FlexBox>
        </FlexBox>

        <FlexBox alignItems="center" gap="10px" sx={{ flexShrink: 0 }}>
          <IconButton aria-label="검색">
            <IconSearch />
          </IconButton>
          <IconButton aria-label="알림">
            <IconBell />
          </IconButton>
          <AvatarButton aria-label="내 프로필">
            <Avatar size="small" sx={avatarStyle}>
              영준
            </Avatar>
          </AvatarButton>
          <Button size="small" variant="outlined" color="assistive">
            기업 서비스
          </Button>
        </FlexBox>
      </FlexBox>
    </Box>
  );
}
