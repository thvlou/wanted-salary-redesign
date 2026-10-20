"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionSummaryContent,
  Box,
  Divider,
  FlexBox,
  Typography,
} from "@wanteddev/wds";
import { IconChevronDown } from "@wanteddev/wds-icon";

import { estimateMonthlyNet, formatManwon } from "@/data/salary";
import {
  chevronStyle,
  detailAccordionStyle,
  detailContentStyle,
  detailDetailsResetStyle,
  detailRowStyle,
  detailSummaryStyle,
} from "./SalaryDetailAccordion.style";

interface SalaryDetailAccordionProps {
  /** 그래프·입력에 실제 적용된 세전 연봉(만원). */
  selectedSalary: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

function DetailRow({
  label,
  value,
  emphasized,
}: {
  label: string;
  value: string;
  /** 최종 결과값은 primary 컬러로 강조한다. */
  emphasized?: boolean;
}) {
  return (
    <FlexBox justifyContent="space-between" alignItems="center" sx={detailRowStyle}>
      <Typography variant="label1" color="semantic.label.neutral">
        {label}
      </Typography>
      <Typography
        variant="headline2"
        weight="bold"
        color={emphasized ? "semantic.primary.normal" : undefined}
      >
        {value}
      </Typography>
    </FlexBox>
  );
}

/**
 * 접힌 상태에서도 가장 중요한 결과(예상 월 실수령액)를 요약으로 노출한다.
 * WDS Accordion 이 WAI-ARIA Accordion 패턴(native button · aria-expanded ·
 * aria-controls · Enter/Space)을 이미 만족하므로 그대로 사용한다.
 */
export function SalaryDetailAccordion({
  selectedSalary,
  expanded,
  onExpandedChange,
}: SalaryDetailAccordionProps) {
  const monthlyNet = estimateMonthlyNet(selectedSalary);
  const monthlyGross = Math.round(selectedSalary / 12);

  return (
    <Accordion
      expanded={expanded}
      onChange={onExpandedChange}
      divider={false}
      sx={detailAccordionStyle}
    >
      {/*
        AccordionSummary 의 children 은 내부적으로 <p> 안에 렌더되므로
        블록 요소를 넣으면 hydration 오류가 난다. 요약값은 형제 영역인
        trailingContent 로 배치한다.
      */}
      <AccordionSummary
        fillWidth
        verticalPadding="medium"
        textProps={{ variant: "label1", weight: "bold" }}
        sx={detailSummaryStyle}
        /* trailingContent 에는 data-role 이 주입되므로 Fragment 가 아닌 단일 요소여야 한다. */
        trailingContent={
          <AccordionSummaryContent variant="custom">
            <FlexBox as="span" alignItems="center" gap="8px">
              <Typography
                variant="label2"
                color="semantic.label.alternative"
                noWrap
              >
                예상 월 실수령액 약 {formatManwon(monthlyNet)}
              </Typography>
              <IconChevronDown sx={chevronStyle(expanded)} />
            </FlexBox>
          </AccordionSummaryContent>
        }
      >
        연봉 상세 보기
      </AccordionSummary>

      <AccordionDetails sx={detailDetailsResetStyle}>
        <Box sx={detailContentStyle}>
          <DetailRow
            label="입력한 연봉 (세전)"
            value={formatManwon(selectedSalary)}
          />
          <Divider />
          <DetailRow
            label="월 세전 급여"
            value={`약 ${formatManwon(monthlyGross)}`}
          />
          <Divider />
          {/* 최종 결론이므로 마지막에 두고 primary 로 강조한다. */}
          <DetailRow
            label="예상 월 실수령액"
            value={`약 ${formatManwon(monthlyNet)}`}
            emphasized
          />
          <Typography
            variant="caption1"
            color="semantic.label.assistive"
            sx={{ marginTop: "12px" }}
          >
            부양가족과 개인별 공제 항목에 따라 실제 수령액은 달라질 수 있어요.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
