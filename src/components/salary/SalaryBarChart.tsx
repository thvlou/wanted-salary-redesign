"use client";

import { useRef, useState } from "react";
import { Box, FlexBox, Typography } from "@wanteddev/wds";

import {
  careerPhrase,
  formatManwon,
  formatManwonRange,
  formatManwonShort,
} from "@/data/salary";
import {
  barSlotStyle,
  barsRowStyle,
  chartRootStyle,
  gridLineStyle,
  legendDotStyle,
  medianBarStyle,
  plotAreaStyle,
  plotRowStyle,
  pointerTooltipStyle,
  rangeBandStyle,
  xAxisLabelStyle,
  xAxisRowStyle,
  yAxisLabelStyle,
} from "./SalaryBarChart.style";

import type { CareerLevel, SalaryPoint } from "@/data/salary";
import type { PointerEvent as ReactPointerEvent } from "react";

/** y축 눈금 간격(만원). 0, 2,000, 4,000 … 형태로 동일 간격 기준선을 그린다. */
const GRID_STEP = 2000;
/** 포인터 위로 띄우는 간격. 위쪽 공간이 부족하면 아래로 flip 한다. */
const POINTER_OFFSET = 14;
const TOOLTIP_ESTIMATED_H = 74;
/** 아직 실측 전인 첫 프레임에 쓰는 tooltip 폭 추정치. */
const TOOLTIP_ESTIMATED_W = 190;
const EDGE_PAD = 4;

/** 툴팁 한 줄: 라벨은 기본 굵기, 숫자+만원만 볼드로 강조한다. */
function TooltipLine({
  label,
  value,
  separator = " : ",
}: {
  label: string;
  value: string;
  separator?: string;
}) {
  return (
    <Typography
      variant="caption1"
      color="semantic.inverse.label"
      display="block"
      noWrap
    >
      {label}
      {separator}
      <Typography
        as="span"
        variant="caption1"
        weight="bold"
        color="semantic.inverse.label"
      >
        {value}
      </Typography>
    </Typography>
  );
}

interface HoverState {
  index: number;
  x: number;
  y: number;
  flip: boolean;
}

interface SalaryBarChartProps {
  curve: SalaryPoint[];
  level: CareerLevel;
  jobName: string;
  onLevelChange: (level: CareerLevel) => void;
}

export function SalaryBarChart({
  curve,
  level,
  jobName,
  onLevelChange,
}: SalaryBarChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  // 재렌더를 유발하지 않도록 실측 폭은 ref 에만 보관한다.
  const tooltipWidthRef = useRef(0);
  const [hover, setHover] = useState<HoverState | null>(null);

  const maxValue = Math.max(...curve.map((point) => point.p75));
  // 최상단 기준선이 항상 데이터 위에 오도록 축 최대값을 눈금 단위로 올림한다.
  const axisMax = Math.ceil((maxValue * 1.02) / GRID_STEP) * GRID_STEP;

  const gridValues: number[] = [];
  for (let value = GRID_STEP; value <= axisMax; value += GRID_STEP) {
    gridValues.push(value);
  }

  // 백분율은 자리수를 고정해 서버·클라이언트 문자열이 어긋나지 않게 한다.
  const pct = (value: number) => `${((value / axisMax) * 100).toFixed(2)}%`;

  /** 포인터 위치를 차트 컨테이너 로컬 좌표로 변환하고 경계 안으로 clamp 한다. */
  const trackPointer = (index: number, event: ReactPointerEvent<HTMLElement>) => {
    const plot = plotRef.current;
    if (!plot) return;

    const rect = plot.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    const flip = localY - POINTER_OFFSET - TOOLTIP_ESTIMATED_H < 0;

    // tooltip 은 translateX(-50%) 로 중앙 정렬되므로 절반 폭만큼 여유를 두고 clamp 해야
    // 좌우 경계에서 잘리지 않는다. 직전 렌더의 실측 폭을 사용한다.
    const measured = tooltipRef.current?.offsetWidth ?? 0;
    if (measured) tooltipWidthRef.current = measured;
    const half = (tooltipWidthRef.current || TOOLTIP_ESTIMATED_W) / 2;
    const minX = half + EDGE_PAD;
    const maxX = rect.width - half - EDGE_PAD;

    setHover({
      index,
      x: maxX < minX ? rect.width / 2 : Math.min(Math.max(localX, minX), maxX),
      y: localY,
      flip,
    });
  };

  const hoveredPoint = hover ? curve[hover.index] : null;
  const hoveredPrevious =
    hover && hover.index > 0 ? curve[hover.index - 1] : undefined;
  const hoveredDelta =
    hoveredPoint && hoveredPrevious
      ? hoveredPoint.median - hoveredPrevious.median
      : null;

  return (
    <Box
      sx={chartRootStyle}
      role="group"
      aria-label={`${jobName} 연차별 예상 연봉 그래프`}
    >
      <FlexBox justifyContent="flex-end" alignItems="center" gap="16px">
        <FlexBox alignItems="center" gap="6px">
          <Box sx={legendDotStyle("median")} />
          <Typography variant="caption1" color="semantic.label.alternative">
            중앙 예상 연봉
          </Typography>
        </FlexBox>
        <FlexBox alignItems="center" gap="6px">
          <Box sx={legendDotStyle("range")} />
          <Typography variant="caption1" color="semantic.label.alternative">
            25~75% 구간
          </Typography>
        </FlexBox>
      </FlexBox>

      <Box sx={[plotRowStyle, { marginTop: "12px" }]}>
        <Box ref={plotRef} sx={plotAreaStyle}>
          {[0, ...gridValues].map((value) => (
            <Box key={value} sx={gridLineStyle} style={{ bottom: pct(value) }}>
              <Typography
                variant="caption2"
                color="semantic.label.neutral"
                sx={yAxisLabelStyle}
              >
                {formatManwonShort(value)}
              </Typography>
            </Box>
          ))}

          <Box sx={barsRowStyle}>
            {curve.map((point, index) => {
              // 선택 강조는 hover 와 별개로 유지되고, hover 는 임시 강조로만 쓴다.
              const selected = point.level === level;
              const hovered = hover?.index === index;

              return (
                <Box
                  key={point.level}
                  sx={barSlotStyle}
                  onClick={() => onLevelChange(point.level)}
                  onPointerEnter={(event: ReactPointerEvent<HTMLElement>) =>
                    trackPointer(index, event)
                  }
                  onPointerMove={(event: ReactPointerEvent<HTMLElement>) =>
                    trackPointer(index, event)
                  }
                  onPointerLeave={() => setHover(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${point.label} 선택`}
                >
                  <Box
                    sx={rangeBandStyle(selected || hovered)}
                    style={{
                      bottom: pct(point.p25),
                      height: pct(point.p75 - point.p25),
                    }}
                  />
                  <Box
                    sx={medianBarStyle(selected || hovered)}
                    style={{ height: pct(point.median) }}
                  />
                </Box>
              );
            })}
          </Box>

          {hover && hoveredPoint && (
            <Box
              ref={tooltipRef}
              sx={pointerTooltipStyle}
              style={{
                left: `${hover.x.toFixed(2)}px`,
                top: `${(hover.flip ? hover.y + POINTER_OFFSET : hover.y - POINTER_OFFSET).toFixed(2)}px`,
                transform: hover.flip
                  ? "translate(-50%, 0)"
                  : "translate(-50%, -100%)",
              }}
            >
              <TooltipLine
                label={hoveredPoint.level === 0 ? "예상 초봉" : "예상 연봉"}
                value={formatManwon(hoveredPoint.median)}
              />
              <TooltipLine
                label="주요 분포"
                value={formatManwonRange(
                  hoveredPoint.p25,
                  hoveredPoint.p75,
                  " ~ ",
                )}
              />
              {hoveredDelta !== null && hoveredPrevious && (
                <TooltipLine
                  label={`${careerPhrase(hoveredPrevious.level)} 대비 +`}
                  value={`${formatManwonShort(hoveredDelta)}만원`}
                  separator=" "
                />
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={xAxisRowStyle}>
        {curve.map((point) => {
          const selected = point.level === level;

          return (
            <Typography
              key={point.level}
              variant="caption1"
              weight={selected ? "bold" : "regular"}
              /* 비선택 축 라벨도 AA 대비를 유지하도록 neutral 을 쓴다. */
              color={
                selected ? "semantic.primary.normal" : "semantic.label.neutral"
              }
              sx={xAxisLabelStyle}
            >
              {point.label}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
}
