import { Box, Divider, FlexBox, Typography } from "@wanteddev/wds";
import {
  IconLogoApple,
  IconLogoFacebook,
  IconLogoGooglePlay,
  IconLogoInstagram,
  IconLogoLinkedIn,
  IconLogoYoutube,
} from "@wanteddev/wds-icon";

import { WantedLogo } from "./WantedLogo";
import {
  footerInnerStyle,
  footerLinkStyle,
  footerLogoStyle,
  footerMetaRowStyle,
  footerRootStyle,
  footerTopStyle,
  socialIconStyle,
} from "./GlobalFooter.style";

const PRIMARY_LINKS = [
  "회사소개",
  "광고문의",
  "고객센터",
  "이용약관",
  "블로그",
  "개인정보 처리방침",
];

const CONTACT_LINKS = [
  "채용서비스 문의",
  "원티드서비스 문의",
  "원티드랩 소식지",
  "프리랜서 문의",
  "취업지원/제휴 문의",
  "IR 문의",
];

const COMPANY_META = [
  ["(주)원티드랩", "대표이사 이복기"],
  ["서울특별시 성동구 뚝섬로1길 25, 20층", "전화번호: 02-539-7118"],
  [
    "사업자등록번호: 209-86-00021",
    "통신판매업신고: 2020-서울성동-3147",
    "유료직업소개사업신고번호: 제2020-3230259-14-5-00018호",
  ],
];

const SOCIALS = [
  { label: "인스타그램", Icon: IconLogoInstagram },
  { label: "페이스북", Icon: IconLogoFacebook },
  { label: "유튜브", Icon: IconLogoYoutube },
  { label: "링크드인", Icon: IconLogoLinkedIn },
  { label: "App Store", Icon: IconLogoApple },
  { label: "Google Play", Icon: IconLogoGooglePlay },
];

export function GlobalFooter() {
  return (
    <Box as="footer" sx={footerRootStyle}>
      <FlexBox flexDirection="column" gap="20px" sx={footerInnerStyle}>
        <FlexBox
          justifyContent="space-between"
          alignItems="center"
          gap="20px"
          sx={footerTopStyle}
        >
          <Box sx={footerLogoStyle}>
            <WantedLogo
              height={17}
              textVariant="body1"
              textColor="semantic.label.neutral"
            />
          </Box>

          <FlexBox as="ul" gap="20px" flexWrap="wrap">
            {PRIMARY_LINKS.map((link) => (
              <Box as="li" key={link}>
                <Typography as="a" href="#" variant="label2" sx={footerLinkStyle}>
                  {link}
                </Typography>
              </Box>
            ))}
          </FlexBox>
        </FlexBox>

        <Divider />

        <FlexBox flexDirection="column" gap="6px">
          {COMPANY_META.map((row) => (
            <FlexBox key={row[0]} gap="10px" sx={footerMetaRowStyle}>
              {row.map((item, index) => (
                <FlexBox key={item} gap="10px" alignItems="center">
                  {index > 0 && (
                    <Typography variant="caption2" color="semantic.label.disable">
                      |
                    </Typography>
                  )}
                  <Typography variant="caption2" color="semantic.label.assistive">
                    {item}
                  </Typography>
                </FlexBox>
              ))}
            </FlexBox>
          ))}
        </FlexBox>

        <FlexBox as="ul" gap="14px" flexWrap="wrap">
          {CONTACT_LINKS.map((link) => (
            <Box as="li" key={link}>
              <Typography as="a" href="#" variant="caption2" sx={footerLinkStyle}>
                {link}
              </Typography>
            </Box>
          ))}
        </FlexBox>

        <FlexBox
          justifyContent="space-between"
          alignItems="center"
          gap="16px"
          sx={footerTopStyle}
        >
          <Typography variant="caption2" color="semantic.label.assistive">
            © 2026 Wanted Lab, Inc.
          </Typography>

          <FlexBox gap="14px" alignItems="center">
            {SOCIALS.map(({ label, Icon }) => (
              <Box key={label} as="a" href="#" aria-label={label} sx={socialIconStyle}>
                <Icon />
              </Box>
            ))}
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Box>
  );
}
