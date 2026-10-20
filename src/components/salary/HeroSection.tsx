"use client";

import { useMemo } from "react";
import {
  Box,
  FlexBox,
  Option,
  OptionGroup,
  Select,
  Typography,
} from "@wanteddev/wds";
import { IconArrowDownThick, IconThunderFill } from "@wanteddev/wds-icon";

import {
  CAREER_LEVELS,
  JOB_CATEGORIES,
  JOB_ROLES,
  careerLabel,
  careerPhrase,
  formatManwon,
  isNewGrad,
  salaryAtTopPercent,
} from "@/data/salary";
import { SalaryBarChart } from "./SalaryBarChart";
import { SalaryMetaInfo } from "./SalaryMetaInfo";
import {
  filterRowStyle,
  heroAmountStyle,
  heroBaseNoteStyle,
  heroChartCellStyle,
  heroGridStyle,
  heroMetaCellStyle,
  heroSummaryCellStyle,
  heroSummaryStyle,
  heroTitleStyle,
  heroTopSpacingStyle,
  trendIconStyle,
  trendSurfaceStyle,
} from "./HeroSection.style";
import { sectionContainerStyle } from "./shared.style";

import type { CareerLevel, SalaryPoint } from "@/data/salary";

interface HeroSectionProps {
  categoryId: string;
  jobId: string;
  jobName: string;
  level: CareerLevel;
  curve: SalaryPoint[];
  point: SalaryPoint | undefined;
  onCategoryChange: (categoryId: string) => void;
  onJobChange: (jobId: string) => void;
  onLevelChange: (level: CareerLevel) => void;
}

export function HeroSection({
  categoryId,
  jobId,
  jobName,
  level,
  curve,
  point,
  onCategoryChange,
  onJobChange,
  onLevelChange,
}: HeroSectionProps) {
  // 선택한 직군에 속한 세부 직무만 보여준다(직군 → 세부 직무 단계 선택).
  const jobsInCategory = useMemo(
    () => JOB_ROLES.filter((role) => role.categoryId === categoryId),
    [categoryId],
  );

  const levelIndex = curve.findIndex((item) => item.level === level);
  const previous = levelIndex > 0 ? curve[levelIndex - 1] : undefined;
  const growthRate =
    point && previous
      ? ((point.median - previous.median) / previous.median) * 100
      : null;

  const handleCategoryChange = (nextCategoryId: string) => {
    onCategoryChange(nextCategoryId);

    const currentRole = JOB_ROLES.find((role) => role.id === jobId);
    if (currentRole?.categoryId !== nextCategoryId) {
      const nextRole = JOB_ROLES.find(
        (role) => role.categoryId === nextCategoryId,
      );
      if (nextRole) onJobChange(nextRole.id);
    }
  };

  const handleJobChange = (nextJobId: string) => {
    if (!JOB_ROLES.some((role) => role.id === nextJobId)) return;
    onJobChange(nextJobId);
  };

  return (
    <Box as="section" sx={[sectionContainerStyle, heroTopSpacingStyle]}>
      <FlexBox gap="8px" alignItems="center" sx={filterRowStyle}>
        {/*
          라벨 텍스트를 없앤 대신 aria-label 로 접근성 이름을 유지한다.
          드롭다운 안의 OptionGroup title 이 어떤 항목인지 다시 알려준다.
        */}
        <Select
          width="156px"
          aria-label="직군"
          value={categoryId}
          onChange={handleCategoryChange}
        >
          <OptionGroup title="직군">
            {JOB_CATEGORIES.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </OptionGroup>
        </Select>

        <Select
          width="220px"
          aria-label="세부 직무"
          value={jobId}
          onChange={handleJobChange}
        >
          <OptionGroup title="세부 직무">
            {jobsInCategory.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </OptionGroup>
        </Select>

        <Select
          width="120px"
          aria-label="연차"
          value={String(level)}
          onChange={(value) => onLevelChange(Number(value))}
        >
          <OptionGroup title="연차">
            {CAREER_LEVELS.map((careerLevel) => (
              <Option key={careerLevel} value={String(careerLevel)}>
                {careerLabel(careerLevel)}
              </Option>
            ))}
          </OptionGroup>
        </Select>
      </FlexBox>

      <Box sx={heroGridStyle}>
        <Box sx={[heroSummaryStyle, heroSummaryCellStyle]}>
          {/* 페이지의 주제이므로 h1 으로 노출한다. */}
          <Typography
            as="h1"
            variant="heading2"
            weight="medium"
            color="semantic.label.neutral"
            sx={heroTitleStyle}
          >
            {careerPhrase(level)} {jobName}{" "}
            {isNewGrad(level) ? "예상 초봉" : "예상 연봉"}
          </Typography>

          {/*
            좁은 화면에서는 한 단계 낮춰(display2) "1억 2,000만원" 같은 긴 금액도
            줄바꿈·잘림 없이 한 줄에 들어가게 한다. md(992px) 이상은 display1.
          */}
          <Typography
            variant="display2"
            md={{ variant: "display1" }}
            weight="bold"
            sx={heroAmountStyle}
          >
            {point ? formatManwon(point.median) : "-"}
          </Typography>

          <Typography
            variant="label2"
            color="semantic.label.alternative"
            sx={heroBaseNoteStyle}
          >
            세전 연봉 기준
          </Typography>

          {/* 아이콘은 좌측 고정, 2줄 텍스트 블록 기준으로 세로 중앙 정렬한다. */}
          {point && (previous ? growthRate !== null : true) && (
            <FlexBox alignItems="center" gap="10px" sx={trendSurfaceStyle}>
              {previous && growthRate !== null ? (
                <>
                  {/*
                    상승은 원티드 브랜드 톤의 번개 아이콘으로 표시한다.
                    하락은 방향이 드러나야 하므로 화살표를 유지한다
                    (증감을 색상만으로 전달하지 않기 위함).
                  */}
                  {growthRate >= 0 ? (
                    <IconThunderFill sx={trendIconStyle(true)} />
                  ) : (
                    <IconArrowDownThick sx={trendIconStyle(false)} />
                  )}
                  <FlexBox flexDirection="column" gap="2px">
                    <Typography
                      variant="headline1"
                      weight="bold"
                      color={
                        growthRate >= 0
                          ? "semantic.primary.normal"
                          : "semantic.status.negative"
                      }
                    >
                      {careerPhrase(previous.level)} 대비{" "}
                      {growthRate >= 0 ? "+" : "-"}
                      {Math.abs(growthRate).toFixed(1)}%
                    </Typography>
                    <Typography
                      variant="label1"
                      color="semantic.label.alternative"
                    >
                      {careerPhrase(previous.level)} 중앙값{" "}
                      {formatManwon(previous.median)}
                    </Typography>
                  </FlexBox>
                </>
              ) : (
                // 신입은 직전 연차가 없으므로 신입 시장 기준으로 대체한다.
                <>
                  <IconThunderFill sx={trendIconStyle(true)} />
                  <FlexBox flexDirection="column" gap="2px">
                    <Typography
                      variant="headline1"
                      weight="bold"
                      color="semantic.primary.normal"
                    >
                      신입 상위 25% {formatManwon(salaryAtTopPercent(point, 25))}
                    </Typography>
                    <Typography
                      variant="label1"
                      color="semantic.label.alternative"
                    >
                      신입 중앙값 {formatManwon(point.median)}
                    </Typography>
                  </FlexBox>
                </>
              )}
            </FlexBox>
          )}
        </Box>

        <Box sx={heroChartCellStyle}>
          <SalaryBarChart
            curve={curve}
            level={level}
            jobName={jobName}
            onLevelChange={onLevelChange}
          />
        </Box>

        {/*
          좌측 하단 여백을 활용해 차트 하단 축과 맞물리게 배치한다.
          DOM 상 차트 뒤에 두어 1열로 접힐 때 "요약 → 차트 → 메타" 순서가 유지된다.
        */}
        <Box sx={heroMetaCellStyle}>
          <SalaryMetaInfo />
        </Box>
      </Box>
    </Box>
  );
}
