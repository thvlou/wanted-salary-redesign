"use client";

import { useRef, useState } from "react";
import {
  Box,
  Tooltip,
  TooltipContent,
  TooltipGroup,
  TooltipTrigger,
  Typography,
} from "@wanteddev/wds";

import {
  DISTRIBUTION_ANCHORS,
  anchorSalaryAt,
  formatManwon,
  getCurveY,
  positionToSalary,
  salaryToPosition,
} from "@/data/salary";
import {
  BASELINE,
  PLOT_TOP,
  anchorDotStyle,
  axisLabelStyle,
  chartRootStyle,
  curveBandStyle,
  guideLineStyle,
  markerCardStyle,
  markerHandleFocusStyle,
  markerHandleStyle,
  plotHitAreaStyle,
  ratioLeft,
} from "./SalaryDistributionChart.style";

import type { SalaryPoint } from "@/data/salary";
import type { PointerEvent as ReactPointerEvent, KeyboardEvent } from "react";

const BAND_H = BASELINE - PLOT_TOP;
/** 방향키 이동 단위(만원). Shift 조합은 큰 단위. */
const STEP = 100;
const BIG_STEP = 500;

/** 곡선 높이 비율 → 컨테이너 기준 top(px). */
const curveTop = (ratio: number) => BASELINE - getCurveY(ratio) * BAND_H;

interface SalaryDistributionChartProps {
  point: SalaryPoint;
  /** 적용된 세전 연봉. null 이면 중앙값을 기본 강조한다. */
  selectedSalary: number | null;
  percentileRank: number | null;
  onSalaryPick: (salary: number) => void;
}

export function SalaryDistributionChart({
  point,
  selectedSalary,
  percentileRank,
  onSalaryPick,
}: SalaryDistributionChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const markerRatio =
    selectedSalary === null ? 0.5 : salaryToPosition(selectedSalary, point);
  const markerTop = curveTop(markerRatio);
  const topPercent =
    percentileRank === null ? null : Math.max(1, 100 - percentileRank);

  /** 포인터 X → plot area 비율. 컨테이너 로컬 좌표로 계산한다. */
  const ratioFromPointer = (clientX: number): number | null => {
    const root = rootRef.current;
    if (!root) return null;

    const rect = root.getBoundingClientRect();
    const padX = 24;
    const plotLeft = rect.left + padX;
    const plotWidth = rect.width - padX * 2;
    if (plotWidth <= 0) return null;

    const clampedX = Math.max(plotLeft, Math.min(clientX, plotLeft + plotWidth));

    return (clampedX - plotLeft) / plotWidth;
  };

  const pickFromPointer = (clientX: number) => {
    const ratio = ratioFromPointer(clientX);
    if (ratio === null) return;
    onSalaryPick(positionToSalary(ratio, point));
  };

  const handleDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    // 활성 pointerId 가 아니면 setPointerCapture 가 throw 하므로 드래그 자체를 막지 않게 감싼다.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* pointer capture 없이도 이동은 동작한다. */
    }
    setDragging(true);
    pickFromPointer(event.clientX);
  };

  const handleDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging) return;
    pickFromPointer(event.clientX);
  };

  const handleDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* 이미 해제된 경우 무시 */
    }
    setDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const delta = event.shiftKey ? BIG_STEP : STEP;
    const base = selectedSalary ?? point.median;

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onSalaryPick(base + delta);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onSalaryPick(Math.max(0, base - delta));
    }
  };

  // 곡선은 ratio 축 위의 종형이므로 좌표를 그대로 샘플링한다.
  const samples = Array.from({ length: 81 }, (_, i) => {
    const ratio = i / 80;
    const x = (ratio * 100).toFixed(2);
    const y = ((1 - getCurveY(ratio)) * 100).toFixed(2);
    return `${x},${y}`;
  });
  const linePath = `M${samples.join(" L")}`;
  const areaPath = `${linePath} L100,100 L0,100 Z`;

  return (
    <Box ref={rootRef} sx={chartRootStyle}>
      <Box sx={curveBandStyle}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          <path d={areaPath} fill="var(--dist-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--dist-line)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </Box>

      {/* plot area 아무 곳이나 클릭·드래그해도 marker 가 이동한다. */}
      <Box
        sx={plotHitAreaStyle}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      />

      <TooltipGroup>
        {DISTRIBUTION_ANCHORS.map((anchor) => (
          <Tooltip key={anchor.label}>
            <TooltipTrigger>
              <Box
                sx={anchorDotStyle}
                style={{
                  left: ratioLeft(anchor.ratio),
                  top: `${curveTop(anchor.ratio).toFixed(2)}px`,
                }}
                aria-label={`${anchor.label} 구간`}
              />
            </TooltipTrigger>
            <TooltipContent size="small">
              <Typography
                variant="caption1"
                color="semantic.inverse.label"
                display="block"
                noWrap
              >
                상위 {100 - anchor.percentileRank}%
              </Typography>
              <Typography
                variant="label2"
                weight="bold"
                color="semantic.inverse.label"
                display="block"
                noWrap
              >
                {formatManwon(anchorSalaryAt(point, anchor))}
              </Typography>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipGroup>

      {DISTRIBUTION_ANCHORS.map((anchor) => (
        <Typography
          key={anchor.label}
          variant="caption1"
          color="semantic.label.neutral"
          sx={axisLabelStyle}
          style={{ left: ratioLeft(anchor.ratio) }}
        >
          {anchor.label}
        </Typography>
      ))}

      <Box
        sx={guideLineStyle}
        style={{
          left: ratioLeft(markerRatio),
          top: `${markerTop.toFixed(2)}px`,
          height: `${(BASELINE - markerTop).toFixed(2)}px`,
        }}
      />

      <Box
        sx={markerCardStyle}
        style={{
          left: ratioLeft(markerRatio),
          top: `${(markerTop - 12).toFixed(2)}px`,
        }}
      >
        <Typography
          variant="label2"
          weight="bold"
          color="semantic.primary.normal"
          display="block"
          noWrap
        >
          {topPercent === null ? "중앙 예상 연봉" : `상위 ${topPercent}%`}
        </Typography>
        <Typography
          variant="caption1"
          color="semantic.label.alternative"
          display="block"
          noWrap
        >
          {formatManwon(selectedSalary ?? point.median)}
        </Typography>
      </Box>

      <Box
        as="button"
        type="button"
        role="slider"
        aria-label="내 연봉 위치 조절"
        aria-valuemin={0}
        aria-valuenow={selectedSalary ?? point.median}
        aria-valuetext={`현재 선택 연봉 ${formatManwon(selectedSalary ?? point.median)}${
          topPercent === null ? "" : `, 동일 조건에서 상위 ${topPercent}%`
        }`}
        sx={[markerHandleStyle(dragging), markerHandleFocusStyle]}
        style={{
          left: ratioLeft(markerRatio),
          top: `${markerTop.toFixed(2)}px`,
        }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        onKeyDown={handleKeyDown}
      />
    </Box>
  );
}
