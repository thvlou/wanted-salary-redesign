"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  ContentBadge,
  FlexBox,
  Grid,
  GridItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
} from "@wanteddev/wds";
import { IconChevronRight, IconCircleInfo } from "@wanteddev/wds-icon";

import { careerPhrase, formatManwonRange, isNewGrad } from "@/data/salary";
import {
  criteriaColumnStyle,
  positionCardStyle,
  positionContentStyle,
  positionLogoStyle,
  positionThumbStyle,
  positionsBodyStyle,
  positionsGridStyle,
} from "./UpgradePositionsSection.style";
import {
  infoIconStyle,
  sectionContainerStyle,
  sectionSpacingStyle,
} from "./shared.style";

import type { CareerLevel, RecommendedPosition } from "@/data/salary";

const INITIAL_COUNT = 3;
const EXPANDED_COUNT = 6;

interface UpgradePositionsSectionProps {
  positions: RecommendedPosition[];
  jobName: string;
  level: CareerLevel;
  hasSalaryInput: boolean;
}

function criteriaTooltip(newGrad: boolean, hasSalaryInput: boolean): string {
  if (newGrad) {
    return "원티드에 등록된 파트너 기업들의 채용 공고 중 선택한 직무의 신입 지원 가능 포지션을 추천해드려요.";
  }
  if (hasSalaryInput) {
    return "원티드에 등록된 파트너 기업들의 채용 공고 중 현재 연봉보다 더 높은 보상을 받을 수 있는 이직 기회를 추정하여 추천해드려요.";
  }

  return "원티드에 등록된 파트너 기업들의 채용 공고 중 선택한 직무와 연차 조건에 맞는 포지션을 추천해드려요.";
}

export function UpgradePositionsSection({
  positions,
  jobName,
  level,
  hasSalaryInput,
}: UpgradePositionsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const newGrad = isNewGrad(level);

  const visible = positions.slice(
    0,
    expanded ? EXPANDED_COUNT : INITIAL_COUNT,
  );
  const canExpand = !expanded && positions.length > INITIAL_COUNT;

  return (
    <Box
      as="section"
      id="upgrade-positions"
      sx={[sectionContainerStyle, sectionSpacingStyle]}
    >
      <Typography as="h2" variant="title3" weight="bold">
        연봉 업그레이드 포지션
      </Typography>

      {/* 현재 추천에 적용된 조건을 보여주는 context label. 조작 가능한 필터가 아니다. */}
      <Box sx={{ marginTop: "10px" }}>
        <ContentBadge color="neutral" size="small" variant="outlined">
          {careerPhrase(level)} · {jobName}
        </ContentBadge>
      </Box>

      <FlexBox gap="24px" sx={[positionsBodyStyle, { marginTop: "20px" }]}>
        <FlexBox flexDirection="column" gap="8px" sx={criteriaColumnStyle}>
          <FlexBox alignItems="center" gap="4px">
            <Typography variant="label1" weight="bold">
              추천 기준
            </Typography>
            <Tooltip>
              <TooltipTrigger>
                <Box as="span" sx={infoIconStyle}>
                  <IconCircleInfo />
                </Box>
              </TooltipTrigger>
              <TooltipContent size="small">
                {criteriaTooltip(newGrad, hasSalaryInput)}
              </TooltipContent>
            </Tooltip>
          </FlexBox>
          <Typography variant="caption1" color="semantic.label.alternative">
            {newGrad
              ? "선택한 직무의 신입 지원 가능 포지션을 확인해보세요."
              : "선택한 직무와 연차를 기준으로 더 높은 보상 가능성이 있는 포지션을 확인해보세요."}
          </Typography>
        </FlexBox>

        <Box sx={positionsGridStyle}>
          {visible.length === 0 ? (
            <Typography variant="body2" color="semantic.label.alternative">
              선택한 조건에 맞는 포지션이 아직 없어요. 연차나 직무를 바꿔서
              확인해보세요.
            </Typography>
          ) : (
            <Grid spacing={16}>
              {visible.map((position) => (
                /* 모바일 1열 → sm 2열 → md 이상 3열 */
                <GridItem
                  key={position.id}
                  columns={12}
                  sm={{ columns: 6 }}
                  md={{ columns: 4 }}
                >
                  <FlexBox
                    as="a"
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    flexDirection="column"
                    sx={positionCardStyle}
                    style={{ "--brand": position.brand } as React.CSSProperties}
                  >
                    <Box sx={positionThumbStyle}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={position.thumbnail}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <Box sx={positionLogoStyle}>
                        <Typography variant="caption1" weight="bold">
                          {position.company}
                        </Typography>
                      </Box>
                    </Box>

                    <FlexBox
                      flexDirection="column"
                      gap="10px"
                      sx={positionContentStyle}
                    >
                      <FlexBox flexDirection="column" gap="2px">
                        <Typography variant="body1" weight="bold" noWrap>
                          {position.title}
                        </Typography>
                        <Typography
                          variant="label2"
                          color="semantic.label.alternative"
                        >
                          {position.company}
                        </Typography>
                        <Typography
                          variant="label2"
                          color="semantic.label.assistive"
                        >
                          {position.location} · {position.experienceLabel}
                        </Typography>
                      </FlexBox>

                      <FlexBox flexDirection="column" gap="2px">
                        <Typography
                          variant="caption1"
                          color="semantic.label.alternative"
                        >
                          예상 보상
                        </Typography>
                        <Typography variant="headline2" weight="bold">
                          {formatManwonRange(
                            position.salaryMin,
                            position.salaryMax,
                          )}
                        </Typography>
                        {position.gapMax !== null && position.gapMax > 0 && (
                          <Typography
                            variant="caption1"
                            weight="bold"
                            color="semantic.primary.normal"
                          >
                            현재 연봉보다 +
                            {formatManwonRange(
                              Math.max(position.gapMin ?? 0, 0),
                              position.gapMax,
                            )}
                          </Typography>
                        )}
                      </FlexBox>

                      <FlexBox gap="6px" flexWrap="wrap">
                        {position.tags.map((tag) => (
                          <Chip
                            key={tag}
                            size="xsmall"
                            variant="outlined"
                            disableInteraction
                          >
                            {tag}
                          </Chip>
                        ))}
                      </FlexBox>

                      <Button fullWidth size="small" sx={{ marginTop: "2px" }}>
                        지원하기
                      </Button>
                    </FlexBox>
                  </FlexBox>
                </GridItem>
              ))}
            </Grid>
          )}
        </Box>
      </FlexBox>

      {canExpand && (
        <FlexBox justifyContent="center" sx={{ marginTop: "28px" }}>
          <Button
            variant="outlined"
            color="assistive"
            trailingContent={<IconChevronRight />}
            onClick={() => setExpanded(true)}
          >
            조건에 맞는 포지션 더보기
          </Button>
        </FlexBox>
      )}
    </Box>
  );
}
