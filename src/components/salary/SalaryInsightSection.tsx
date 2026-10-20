"use client";

import { Box, Button, FlexBox, Typography } from "@wanteddev/wds";
import { IconArrowDown } from "@wanteddev/wds-icon";

import {
  estimateMonthlyNet,
  formatManwon,
  isNewGrad,
  salaryAtTopPercent,
} from "@/data/salary";
import {
  insightCtaStyle,
  insightLeadStyle,
  insightSurfaceStyle,
  insightTierStyle,
  insightTiersStyle,
} from "./SalaryInsightSection.style";
import { sectionContainerStyle, sectionSpacingStyle } from "./shared.style";
import { SPACING, px } from "@/styles/spacing";

import type { CareerLevel, SalaryPoint } from "@/data/salary";

const TOP_TIERS = [30, 20, 10];

interface SalaryInsightSectionProps {
  level: CareerLevel;
  point: SalaryPoint | undefined;
  submittedValue: number | null;
  onGoToPositions: () => void;
}

export function SalaryInsightSection({
  level,
  point,
  submittedValue,
  onGoToPositions,
}: SalaryInsightSectionProps) {
  if (!point) return null;

  const newGrad = isNewGrad(level);
  const baseline = submittedValue ?? point.median;
  const tiers = TOP_TIERS.map((topPercent) => {
    const salary = salaryAtTopPercent(point, topPercent);

    return { topPercent, salary, gap: salary - baseline };
  });

  // 가장 현실적인 다음 목표(상위 20%)를 기준으로 한 문장 요약을 만든다.
  const headlineTier = tiers[1];
  const monthlyNetGap =
    submittedValue === null
      ? null
      : estimateMonthlyNet(headlineTier.salary) -
        estimateMonthlyNet(submittedValue);

  return (
    <Box as="section" sx={[sectionContainerStyle, sectionSpacingStyle]}>
      <FlexBox sx={insightSurfaceStyle}>
        <FlexBox
          flexDirection="column"
          gap={px(SPACING.tight)}
          sx={insightLeadStyle}
        >
          {/* 다른 섹션 제목(title3)과 위계를 맞춘다. */}
          <Typography as="h2" variant="title3" weight="bold">
            연봉 인사이트
          </Typography>
          <Typography variant="body2" color="semantic.label.alternative">
            {newGrad
              ? "신입 시장에서 상위 수준은 어느 정도일까요?"
              : "내 연봉을 같은 직무·연차의 상위 보상 기준과 비교해드려요"}
          </Typography>
        </FlexBox>

        <FlexBox sx={insightTiersStyle}>
          {tiers.map((tier) => (
            <FlexBox
              key={tier.topPercent}
              flexDirection="column"
              gap="4px"
              sx={insightTierStyle}
            >
              <Typography variant="label2" color="semantic.label.alternative">
                상위 {tier.topPercent}% 연봉
              </Typography>
              <Typography
                variant="heading2"
                weight="bold"
                color="semantic.primary.normal"
              >
                {formatManwon(tier.salary)}
              </Typography>
              <Typography variant="caption1" color="semantic.label.assistive">
                {submittedValue === null
                  ? `중앙값 대비 +${formatManwon(tier.gap)}`
                  : tier.gap > 0
                    ? `현재보다 +${formatManwon(tier.gap)}`
                    : "이미 넘은 수준이에요"}
              </Typography>
            </FlexBox>
          ))}
        </FlexBox>

        <FlexBox
          flexDirection="column"
          justifyContent="center"
          gap="12px"
          sx={insightCtaStyle}
        >
          <Typography variant="body2" color="semantic.label.neutral">
            {submittedValue !== null && monthlyNetGap !== null && monthlyNetGap > 0
              ? `상위 ${headlineTier.topPercent}%까지는 월 실수령액 기준 약 ${formatManwon(monthlyNetGap)} 차이예요.`
              : "더 높은 보상의 기회를 확인해보세요"}
          </Typography>
          <Button
            fullWidth
            trailingContent={<IconArrowDown />}
            onClick={onGoToPositions}
          >
            연봉 업그레이드 포지션 보기
          </Button>
        </FlexBox>
      </FlexBox>
    </Box>
  );
}
