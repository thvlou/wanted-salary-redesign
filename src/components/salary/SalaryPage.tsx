"use client";

import { useMemo, useState } from "react";

import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { GlobalNav } from "@/components/layout/GlobalNav";
import {
  JOB_ROLES,
  getRecommendedPositions,
  getSalaryCurve,
} from "@/data/salary";
import { HeroSection } from "./HeroSection";
import { SalaryCompareSection } from "./SalaryCompareSection";
import { SalaryInsightSection } from "./SalaryInsightSection";
import { UpgradePositionsSection } from "./UpgradePositionsSection";

import type { CareerLevel } from "@/data/salary";

const DEFAULT_JOB_ID = "frontend-dev";
const DEFAULT_LEVEL = 5;

export function SalaryPage() {
  // 직군·직무·연차는 페이지 전체가 공유하는 단일 상태다.
  const [categoryId, setCategoryId] = useState("frontend");
  const [jobId, setJobId] = useState(DEFAULT_JOB_ID);
  const [level, setLevel] = useState<CareerLevel>(DEFAULT_LEVEL);

  // annualSalaryInput: 입력 중인 문자열 / selectedSalary: 실제 적용된 값(파생 결과의 근거)
  const [annualSalaryInput, setAnnualSalaryInput] = useState("");
  const [selectedSalary, setSelectedSalary] = useState<number | null>(null);
  const [isSalaryDetailOpen, setIsSalaryDetailOpen] = useState(false);

  const selectedJob = useMemo(
    () => JOB_ROLES.find((role) => role.id === jobId) ?? JOB_ROLES[0],
    [jobId],
  );
  const curve = useMemo(() => getSalaryCurve(jobId), [jobId]);
  const point = curve.find((item) => item.level === level);

  const positions = useMemo(
    () => getRecommendedPositions(jobId, level, point, selectedSalary),
    [jobId, level, point, selectedSalary],
  );

  // 조건이 바뀌면 이전 조건에서 계산한 결과가 남지 않도록 초기화한다.
  const resetSalary = () => {
    setSelectedSalary(null);
    setAnnualSalaryInput("");
    setIsSalaryDetailOpen(false);
  };

  const handleJobChange = (nextJobId: string) => {
    setJobId(nextJobId);
    resetSalary();
  };

  const handleLevelChange = (nextLevel: CareerLevel) => {
    setLevel(nextLevel);
    resetSalary();
  };

  /** `입력하기` → 입력 문자열을 검증해 selectedSalary 로 확정한다. */
  const handleSubmitSalary = () => {
    const value = Number(annualSalaryInput);
    if (Number.isFinite(value) && value > 0) setSelectedSalary(value);
  };

  /** 그래프 드래그·클릭·키보드 → 입력창과 선택값을 함께 갱신한다. */
  const handleSalaryPick = (salary: number) => {
    setSelectedSalary(salary);
    setAnnualSalaryInput(String(salary));
  };

  const scrollToPositions = () => {
    // 모션 최소화 설정에서는 부드러운 스크롤을 쓰지 않는다.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.getElementById("upgrade-positions")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      <GlobalNav />
      <main>
        <HeroSection
          categoryId={categoryId}
          jobId={jobId}
          jobName={selectedJob.name}
          level={level}
          curve={curve}
          point={point}
          onCategoryChange={setCategoryId}
          onJobChange={handleJobChange}
          onLevelChange={handleLevelChange}
        />
        <SalaryCompareSection
          jobName={selectedJob.name}
          level={level}
          point={point}
          draftValue={annualSalaryInput}
          selectedSalary={selectedSalary}
          detailOpen={isSalaryDetailOpen}
          onDraftChange={setAnnualSalaryInput}
          onSubmit={handleSubmitSalary}
          onSalaryPick={handleSalaryPick}
          onDetailOpenChange={setIsSalaryDetailOpen}
        />
        <SalaryInsightSection
          level={level}
          point={point}
          submittedValue={selectedSalary}
          onGoToPositions={scrollToPositions}
        />
        <UpgradePositionsSection
          positions={positions}
          jobName={selectedJob.name}
          level={level}
          hasSalaryInput={selectedSalary !== null}
        />
      </main>
      <GlobalFooter />
    </>
  );
}
