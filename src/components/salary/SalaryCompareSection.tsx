"use client";

import { Box, Button, FlexBox, TextField, TextFieldContent, Typography } from "@wanteddev/wds";

import {
  formatManwon,
  isNewGrad,
  percentileRankOf,
  salaryAtTopPercent,
} from "@/data/salary";
import { SalaryDetailAccordion } from "./SalaryDetailAccordion";
import { SalaryDistributionChart } from "./SalaryDistributionChart";
import {
  benchmarkRowStyle,
  compareBodyStyle,
  compareChartColumnStyle,
  compareInputColumnStyle,
} from "./SalaryCompareSection.style";
import {
  sectionContainerStyle,
  sectionSpacingStyle,
  softSurfaceStyle,
} from "./shared.style";

import type { CareerLevel, SalaryPoint } from "@/data/salary";

interface SalaryCompareSectionProps {
  jobName: string;
  level: CareerLevel;
  point: SalaryPoint | undefined;
  /** TextField 에 입력 중인 문자열. */
  draftValue: string;
  /** 그래프·결과에 실제 적용된 연봉. 이 값이 파생 결과의 source of truth. */
  selectedSalary: number | null;
  detailOpen: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  /** 그래프 드래그·클릭으로 연봉이 바뀔 때. */
  onSalaryPick: (salary: number) => void;
  onDetailOpenChange: (open: boolean) => void;
}

export function SalaryCompareSection({
  jobName,
  level,
  point,
  draftValue,
  selectedSalary,
  detailOpen,
  onDraftChange,
  onSubmit,
  onSalaryPick,
  onDetailOpenChange,
}: SalaryCompareSectionProps) {
  if (!point) return null;

  const newGrad = isNewGrad(level);
  const rank =
    selectedSalary === null ? null : percentileRankOf(selectedSalary, point);
  const diffFromMedian =
    selectedSalary === null ? null : selectedSalary - point.median;

  const draftNumber = Number(draftValue);
  const canSubmit = draftValue.trim() !== "" && draftNumber > 0;
  const top25 = salaryAtTopPercent(point, 25);

  return (
    <Box
      as="section"
      id="salary-compare"
      sx={[sectionContainerStyle, sectionSpacingStyle]}
    >
      <Typography as="h2" variant="title3" weight="bold">
        내 연봉과 비교해보세요
      </Typography>

      <Box sx={[compareBodyStyle, { marginTop: "12px" }]}>
        <FlexBox flexDirection="column" gap="8px" sx={compareChartColumnStyle}>
          <Typography as="h3" variant="headline2" weight="bold">
            내 연봉 위치
          </Typography>
          <Typography variant="body2" color="semantic.label.alternative">
            동일 직무·연차의 시장 연봉 분포에서 내 위치를 확인할 수 있어요.
          </Typography>
          <Box sx={{ marginTop: "12px" }}>
            <SalaryDistributionChart
              point={point}
              selectedSalary={selectedSalary}
              percentileRank={rank}
              onSalaryPick={onSalaryPick}
            />
          </Box>
        </FlexBox>

        <FlexBox flexDirection="column" gap="14px" sx={compareInputColumnStyle}>
          {/* 신입은 비교 기준이 될 현재 연봉이 없을 수 있어 시장 벤치마크를 먼저 보여준다. */}
          {newGrad && (
            <FlexBox flexDirection="column" gap="10px" sx={softSurfaceStyle}>
              <Typography variant="body2" color="semantic.label.neutral">
                신입 {jobName}의 예상 초봉은{" "}
                <Typography as="span" variant="body2" weight="bold">
                  {formatManwon(point.median)}
                </Typography>
                이에요.
              </Typography>
              <FlexBox gap="8px" flexWrap="wrap">
                <FlexBox
                  flexDirection="column"
                  gap="2px"
                  sx={[benchmarkRowStyle, { flex: "1 1 140px" }]}
                >
                  <Typography variant="caption1" color="semantic.label.alternative">
                    중앙 예상 초봉
                  </Typography>
                  <Typography variant="headline2" weight="bold">
                    {formatManwon(point.median)}
                  </Typography>
                </FlexBox>
                <FlexBox
                  flexDirection="column"
                  gap="2px"
                  sx={[benchmarkRowStyle, { flex: "1 1 140px" }]}
                >
                  <Typography variant="caption1" color="semantic.label.alternative">
                    상위 25% 수준
                  </Typography>
                  <Typography
                    variant="headline2"
                    weight="bold"
                    color="semantic.primary.normal"
                  >
                    {formatManwon(top25)}
                  </Typography>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          )}

          <Typography variant="body2" color="semantic.label.neutral">
            내 연봉을 계산하고 비교해보세요
          </Typography>

          <FlexBox
            as="form"
            gap="8px"
            alignItems="center"
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();
              if (canSubmit) onSubmit();
            }}
          >
            <TextField
              width="100%"
              inputMode="numeric"
              placeholder="예: 6000"
              value={draftValue}
              onChange={(event) =>
                onDraftChange(event.target.value.replace(/[^0-9]/g, ""))
              }
              /* form 의 암묵적 submit 에 의존하지 않고 Enter 를 직접 처리한다. */
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (canSubmit) onSubmit();
                }
              }}
              trailingContent={
                <TextFieldContent variant="text">만 원</TextFieldContent>
              }
            />
            <Button type="submit" disabled={!canSubmit} sx={{ flexShrink: 0 }}>
              입력하기
            </Button>
          </FlexBox>

          {selectedSalary !== null && (
            <SalaryDetailAccordion
              selectedSalary={selectedSalary}
              expanded={detailOpen}
              onExpandedChange={onDetailOpenChange}
            />
          )}

          {diffFromMedian !== null &&
            (diffFromMedian === 0 ? (
              <Typography variant="body2" color="semantic.label.neutral">
                동일 직무·연차의 중앙 예상 연봉과 같은 수준이에요.
              </Typography>
            ) : (
              <Typography variant="body2" color="semantic.label.neutral">
                동일 직무·연차의 중앙 예상 연봉보다{" "}
                <Typography as="span" variant="body2" weight="bold">
                  {formatManwon(Math.abs(diffFromMedian))}
                </Typography>{" "}
                {diffFromMedian > 0 ? "높아요." : "낮아요."}
              </Typography>
            ))}
        </FlexBox>
      </Box>
    </Box>
  );
}
