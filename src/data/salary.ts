/**
 * 연봉 데이터 더미 레이어.
 *
 * 연차는 0(신입) ~ 10 사이의 정수와, 10년 이상을 뜻하는 센티널 11(`OVER_TEN`)로 표현한다.
 */

export const OVER_TEN = 11;

export const CAREER_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, OVER_TEN];

export type CareerLevel = number;

/** Select 옵션 · 차트 축에 쓰는 짧은 라벨. */
export function careerLabel(level: CareerLevel): string {
  if (level === 0) return "신입";
  if (level === OVER_TEN) return "10년+";
  return `${level}년`;
}

/** 제목·툴팁에 쓰는 서술형 라벨. */
export function careerPhrase(level: CareerLevel): string {
  if (level === 0) return "신입";
  if (level === OVER_TEN) return "10년 이상";
  return `${level}년차`;
}

export function isNewGrad(level: CareerLevel): boolean {
  return level === 0;
}

export interface JobCategory {
  id: string;
  name: string;
}

export interface JobRole {
  id: string;
  name: string;
  categoryId: string;
  /** 신입 기준 중앙 예상 연봉(만원). 연차별 곡선의 기준값. */
  entryMedian: number;
}

export const JOB_CATEGORIES: JobCategory[] = [
  { id: "frontend", name: "프론트엔드" },
  { id: "backend", name: "백엔드" },
  { id: "mobile", name: "모바일" },
  { id: "design", name: "디자인" },
  { id: "product", name: "기획·PM" },
  { id: "data", name: "데이터·AI" },
  { id: "marketing", name: "마케팅" },
];

export const JOB_ROLES: JobRole[] = [
  { id: "frontend-dev", name: "프론트엔드 개발자", categoryId: "frontend", entryMedian: 3600 },
  { id: "web-publisher", name: "웹 퍼블리셔", categoryId: "frontend", entryMedian: 3100 },
  { id: "react-dev", name: "React 개발자", categoryId: "frontend", entryMedian: 3700 },

  { id: "backend-dev", name: "백엔드 개발자", categoryId: "backend", entryMedian: 3700 },
  { id: "server-dev", name: "서버 개발자", categoryId: "backend", entryMedian: 3700 },
  { id: "devops", name: "DevOps · 인프라 엔지니어", categoryId: "backend", entryMedian: 3900 },
  { id: "qa", name: "QA 엔지니어", categoryId: "backend", entryMedian: 3200 },

  { id: "ios-dev", name: "iOS 개발자", categoryId: "mobile", entryMedian: 3700 },
  { id: "android-dev", name: "Android 개발자", categoryId: "mobile", entryMedian: 3700 },
  { id: "cross-platform-dev", name: "크로스플랫폼 개발자", categoryId: "mobile", entryMedian: 3600 },

  { id: "product-designer", name: "프로덕트 디자이너", categoryId: "design", entryMedian: 3300 },
  { id: "ux-designer", name: "UX 디자이너", categoryId: "design", entryMedian: 3200 },
  { id: "ui-designer", name: "UI 디자이너", categoryId: "design", entryMedian: 3100 },
  { id: "bx-designer", name: "BX 디자이너", categoryId: "design", entryMedian: 3100 },

  { id: "product-manager", name: "프로덕트 매니저", categoryId: "product", entryMedian: 3600 },
  { id: "service-planner", name: "서비스 기획자", categoryId: "product", entryMedian: 3200 },
  { id: "project-manager", name: "프로젝트 매니저", categoryId: "product", entryMedian: 3300 },

  { id: "data-analyst", name: "데이터 분석가", categoryId: "data", entryMedian: 3500 },
  { id: "data-scientist", name: "데이터 사이언티스트", categoryId: "data", entryMedian: 4000 },
  { id: "ml-engineer", name: "머신러닝 엔지니어", categoryId: "data", entryMedian: 4200 },
  { id: "data-engineer", name: "데이터 엔지니어", categoryId: "data", entryMedian: 3900 },

  { id: "performance-marketer", name: "퍼포먼스 마케터", categoryId: "marketing", entryMedian: 3100 },
  { id: "brand-marketer", name: "브랜드 마케터", categoryId: "marketing", entryMedian: 3000 },
  { id: "growth-marketer", name: "그로스 마케터", categoryId: "marketing", entryMedian: 3300 },
  { id: "content-marketer", name: "콘텐츠 마케터", categoryId: "marketing", entryMedian: 2900 },
];

/** 신입 대비 연차별 중앙값 배수. 인덱스는 CAREER_LEVELS와 1:1 대응. */
const MEDIAN_MULTIPLIER = [
  1.0, 1.111, 1.25, 1.389, 1.611, 1.722, 1.833, 1.944, 2.028, 2.139, 2.222,
  2.611,
];

/** 연차가 쌓일수록 분포가 넓어진다고 가정한 사분위 폭. */
const QUARTILE_SPREAD = [
  0.16, 0.18, 0.2, 0.22, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3, 0.32,
];

export interface SalaryPoint {
  level: CareerLevel;
  label: string;
  median: number;
  p25: number;
  p75: number;
}

const roundTo = (value: number, unit: number) => Math.round(value / unit) * unit;

export function getSalaryCurve(jobId: string): SalaryPoint[] {
  const entryMedian =
    JOB_ROLES.find((role) => role.id === jobId)?.entryMedian ?? 3500;

  return CAREER_LEVELS.map((level, index) => {
    const median = roundTo(entryMedian * MEDIAN_MULTIPLIER[index], 100);
    const spread = QUARTILE_SPREAD[index];

    return {
      level,
      label: careerLabel(level),
      median,
      p25: roundTo(median * (1 - spread), 50),
      p75: roundTo(median * (1 + spread), 50),
    };
  });
}

/**
 * 분포를 정규분포로 근사한다. 정규분포에서 IQR = 1.349σ 이므로
 * p25/p75 두 점에서 표준편차를 역산할 수 있다.
 */
export function getSigma(point: SalaryPoint): number {
  return Math.max((point.p75 - point.p25) / 1.349, 1);
}

/** 표준정규 누적분포 근사 (Abramowitz & Stegun 26.2.17). */
function standardNormalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absZ);
  const density = Math.exp(-0.5 * absZ * absZ) / Math.sqrt(2 * Math.PI);
  const poly =
    t * (0.319381530 +
      t * (-0.356563782 +
        t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));

  return 0.5 * (1 + sign * (1 - 2 * density * poly));
}

/** 표준정규 확률밀도. 분포 곡선을 그릴 때 사용한다. */
export function standardNormalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

/** 값이 분포에서 하위 몇 %에 해당하는지(백분위 순위, 1~99). */
export function percentileRankOf(value: number, point: SalaryPoint): number {
  const z = (value - point.median) / getSigma(point);
  const rank = standardNormalCdf(z) * 100;

  return Math.min(99, Math.max(1, Math.round(rank)));
}

/** 상위 N%가 되려면 필요한 연봉. */
const Z_BY_TOP_PERCENT: Record<number, number> = {
  5: 1.6449,
  10: 1.2816,
  20: 0.8416,
  25: 0.6745,
  30: 0.5244,
  50: 0,
};

export function salaryAtTopPercent(
  point: SalaryPoint,
  topPercent: number,
): number {
  const z = Z_BY_TOP_PERCENT[topPercent] ?? 0;

  return roundTo(point.median + z * getSigma(point), 100);
}

/**
 * 세전 연봉(만원) → 예상 월 실수령액(만원).
 * 4대보험·소득세를 구간별 유효세율로 근사한 값이며 개인별 공제는 반영하지 않는다.
 */
export function estimateMonthlyNet(grossAnnual: number): number {
  const brackets: Array<[limit: number, rate: number]> = [
    [3000, 0.895],
    [4000, 0.868],
    [5000, 0.842],
    [6000, 0.822],
    [7000, 0.806],
    [8000, 0.789],
    [10000, 0.768],
    [Infinity, 0.735],
  ];
  const rate =
    brackets.find(([limit]) => grossAnnual <= limit)?.[1] ?? 0.735;

  return Math.round((grossAnnual * rate) / 12);
}

/**
 * 분포 그래프의 기준 지점.
 * 축 라벨 · 곡선 기준점 · hover 타깃 · 키보드 이동이 모두 이 배열 하나를 공유한다.
 * ratio 는 plot area 안의 가로 위치(0~1)로 항상 동일 간격이며,
 * z 는 해당 백분위의 표준정규 분위수다.
 */
export const DISTRIBUTION_ANCHORS = [
  { label: "하위", ratio: 0, percentileRank: 5, z: -1.6449 },
  { label: "중하위", ratio: 0.25, percentileRank: 25, z: -0.6745 },
  { label: "중간", ratio: 0.5, percentileRank: 50, z: 0 },
  { label: "중상위", ratio: 0.75, percentileRank: 75, z: 0.6745 },
  { label: "상위", ratio: 1, percentileRank: 95, z: 1.6449 },
] as const;

/** 시각적 종형 곡선의 z 범위. 가로 위치는 동일 간격이므로 표시용으로만 쓴다. */
const CURVE_Z_RANGE = 2.2;

/** ratio(0~1) → 곡선 높이 비율(0~1, 1이 정점). */
export function getCurveY(ratio: number): number {
  const z = (ratio - 0.5) * 2 * CURVE_Z_RANGE;

  return standardNormalPdf(z) / standardNormalPdf(0);
}

function anchorSalary(point: SalaryPoint, z: number): number {
  return point.median + z * getSigma(point);
}

/** 두 기준점 사이를 선형 보간한다. */
function interpolate(
  ratio: number,
  toValue: (anchor: (typeof DISTRIBUTION_ANCHORS)[number]) => number,
): number {
  const clamped = Math.min(1, Math.max(0, ratio));
  const lastIndex = DISTRIBUTION_ANCHORS.length - 1;

  for (let i = 0; i < lastIndex; i++) {
    const from = DISTRIBUTION_ANCHORS[i];
    const to = DISTRIBUTION_ANCHORS[i + 1];

    if (clamped <= to.ratio) {
      const span = to.ratio - from.ratio;
      const t = span === 0 ? 0 : (clamped - from.ratio) / span;

      return toValue(from) + (toValue(to) - toValue(from)) * t;
    }
  }

  return toValue(DISTRIBUTION_ANCHORS[lastIndex]);
}

/** plot area 가로 위치(0~1) → 세전 연봉(만원). */
export function positionToSalary(ratio: number, point: SalaryPoint): number {
  const value = interpolate(ratio, (anchor) => anchorSalary(point, anchor.z));

  return Math.max(0, roundTo(value, 100));
}

/** 세전 연봉(만원) → plot area 가로 위치(0~1). */
export function salaryToPosition(salary: number, point: SalaryPoint): number {
  const anchors = DISTRIBUTION_ANCHORS;
  const first = anchorSalary(point, anchors[0].z);
  const last = anchorSalary(point, anchors[anchors.length - 1].z);

  if (salary <= first) return 0;
  if (salary >= last) return 1;

  for (let i = 0; i < anchors.length - 1; i++) {
    const fromSalary = anchorSalary(point, anchors[i].z);
    const toSalary = anchorSalary(point, anchors[i + 1].z);

    if (salary <= toSalary) {
      const span = toSalary - fromSalary;
      const t = span === 0 ? 0 : (salary - fromSalary) / span;

      return anchors[i].ratio + (anchors[i + 1].ratio - anchors[i].ratio) * t;
    }
  }

  return 1;
}

/** plot area 가로 위치(0~1) → 백분위 순위(하위 기준 %). */
export function positionToPercentile(ratio: number): number {
  return Math.round(interpolate(ratio, (anchor) => anchor.percentileRank));
}

/** 기준 지점의 연봉. Tooltip 표시에 사용한다. */
export function anchorSalaryAt(
  point: SalaryPoint,
  anchor: (typeof DISTRIBUTION_ANCHORS)[number],
): number {
  return roundTo(anchorSalary(point, anchor.z), 100);
}

export interface PositionTemplate {
  id: string;
  company: string;
  title: string;
  location: string;
  minYears: number;
  /** 상한이 없는 공고는 null. */
  maxYears: number | null;
  newGradOk: boolean;
  /** 선택 연차 중앙값 대비 예상 보상 배수. */
  payMin: number;
  payMax: number;
  tags: string[];
  brand: string;
}

const POSITION_POOL: PositionTemplate[] = [
  {
    id: "line",
    company: "LINE",
    title: "{job}",
    location: "서울",
    minYears: 3,
    maxYears: 6,
    newGradOk: false,
    payMin: 1.13,
    payMax: 1.45,
    tags: ["유연근무", "스톡옵션"],
    brand: "#06C755",
  },
  {
    id: "wantedlab",
    company: "원티드랩",
    title: "{job}",
    location: "서울",
    minYears: 4,
    maxYears: 7,
    newGradOk: false,
    payMin: 1.21,
    payMax: 1.53,
    tags: ["재택근무", "성과급"],
    brand: "#3366FF",
  },
  {
    id: "toss",
    company: "토스",
    title: "{job}",
    location: "서울",
    minYears: 5,
    maxYears: 8,
    newGradOk: false,
    payMin: 1.29,
    payMax: 1.77,
    tags: ["유연근무", "스톡옵션"],
    brand: "#0064FF",
  },
  {
    id: "karrot",
    company: "당근",
    title: "{job}",
    location: "서울",
    minYears: 2,
    maxYears: 5,
    newGradOk: false,
    payMin: 1.11,
    payMax: 1.4,
    tags: ["수평 조직", "재택근무"],
    brand: "#FF6F0F",
  },
  {
    id: "kakao",
    company: "카카오",
    title: "{job}",
    location: "경기 성남",
    minYears: 1,
    maxYears: 4,
    newGradOk: false,
    payMin: 1.09,
    payMax: 1.36,
    tags: ["대기업", "복지 우수"],
    brand: "#FEE500",
  },
  {
    id: "naver",
    company: "네이버",
    title: "{job}",
    location: "경기 성남",
    minYears: 0,
    maxYears: 3,
    newGradOk: true,
    payMin: 1.07,
    payMax: 1.32,
    tags: ["신입 지원 가능", "교육 지원"],
    brand: "#03C75A",
  },
  {
    id: "coupang",
    company: "쿠팡",
    title: "{job}",
    location: "서울",
    minYears: 0,
    maxYears: 2,
    newGradOk: true,
    payMin: 1.1,
    payMax: 1.35,
    tags: ["신입 지원 가능", "글로벌"],
    brand: "#AE0000",
  },
  {
    id: "baemin",
    company: "우아한형제들",
    title: "{job}",
    location: "서울",
    minYears: 0,
    maxYears: 3,
    newGradOk: true,
    payMin: 1.12,
    payMax: 1.38,
    tags: ["신입 지원 가능", "유연근무"],
    brand: "#2AC1BC",
  },
  {
    id: "yanolja",
    company: "야놀자",
    title: "{job}",
    location: "서울",
    minYears: 6,
    maxYears: 10,
    newGradOk: false,
    payMin: 1.24,
    payMax: 1.6,
    tags: ["글로벌", "대규모 트래픽"],
    brand: "#FF3478",
  },
  {
    id: "socar",
    company: "쏘카",
    title: "{job}",
    location: "서울",
    minYears: 7,
    maxYears: null,
    newGradOk: false,
    payMin: 1.26,
    payMax: 1.64,
    tags: ["리드 포지션", "스톡옵션"],
    brand: "#5B21B6",
  },
  {
    id: "musinsa",
    company: "무신사",
    title: "{job}",
    location: "서울",
    minYears: 3,
    maxYears: 8,
    newGradOk: false,
    payMin: 1.15,
    payMax: 1.48,
    tags: ["빠른 성장", "성과급"],
    brand: "#111111",
  },
  {
    id: "hyperconnect",
    company: "하이퍼커넥트",
    title: "{job}",
    location: "서울",
    minYears: 2,
    maxYears: 7,
    newGradOk: false,
    payMin: 1.18,
    payMax: 1.52,
    tags: ["글로벌", "높은 자율성"],
    brand: "#7C3AED",
  },
  {
    id: "riiid",
    company: "뤼이드",
    title: "{job}",
    location: "서울",
    minYears: 8,
    maxYears: null,
    newGradOk: false,
    payMin: 1.3,
    payMax: 1.72,
    tags: ["리드 포지션", "AI"],
    brand: "#0EA5E9",
  },
  {
    id: "danggeun-pay",
    company: "당근페이",
    title: "{job}",
    location: "서울",
    minYears: 5,
    maxYears: 10,
    newGradOk: false,
    payMin: 1.22,
    payMax: 1.58,
    tags: ["핀테크", "스톡옵션"],
    brand: "#FF8A3D",
  },
];

/** public 에 넣어둔 기업 이미지. 실제 확장자(webp/jpg)를 그대로 쓴다. */
const POSITION_THUMBNAILS = [
  "/1.webp",
  "/2.jpg",
  "/3.webp",
  "/4.webp",
  "/5.jpg",
  "/6.jpg",
];

/**
 * 목록 순서대로 이미지를 하나씩 돌려 배정한다(중복 없음).
 * 시작 offset 은 직무 해시로 정해서 직무마다 다른 조합이 나오되,
 * 매 렌더 난수를 쓰지 않으므로 SSR/CSR 결과가 어긋나지 않는다.
 */
function thumbnailFor(seed: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return POSITION_THUMBNAILS[(hash + index) % POSITION_THUMBNAILS.length];
}

export interface RecommendedPosition {
  id: string;
  company: string;
  title: string;
  location: string;
  experienceLabel: string;
  salaryMin: number;
  salaryMax: number;
  /** 내 연봉을 입력한 경우에만 계산되는 예상 상승 폭. */
  gapMin: number | null;
  gapMax: number | null;
  tags: string[];
  brand: string;
  thumbnail: string;
}

function experienceLabel(template: PositionTemplate): string {
  if (template.newGradOk && template.minYears === 0) {
    return template.maxYears === null
      ? "신입 지원 가능"
      : `신입~${template.maxYears}년`;
  }
  if (template.maxYears === null) return `경력 ${template.minYears}년 이상`;

  return `경력 ${template.minYears}~${template.maxYears}년`;
}

function matchesLevel(template: PositionTemplate, level: CareerLevel): boolean {
  if (isNewGrad(level)) return template.newGradOk;

  const years = level === OVER_TEN ? 12 : level;
  const withinMin = years >= template.minYears;
  const withinMax = template.maxYears === null || years <= template.maxYears;

  return withinMin && withinMax;
}

/**
 * 상단에서 선택한 직무·연차를 그대로 상속해 포지션을 필터링한다.
 * 내 연봉을 입력했다면 예상 상승 폭이 큰 순으로, 아니라면 보상 수준 순으로 정렬한다.
 */
export function getRecommendedPositions(
  jobId: string,
  level: CareerLevel,
  point: SalaryPoint | undefined,
  myGrossAnnual: number | null,
): RecommendedPosition[] {
  const jobName = JOB_ROLES.find((role) => role.id === jobId)?.name ?? "직무";
  const base = point?.median ?? 0;

  return POSITION_POOL.filter((template) => matchesLevel(template, level))
    .map((template) => {
      const salaryMin = roundTo(base * template.payMin, 100);
      const salaryMax = roundTo(base * template.payMax, 100);

      return {
        id: `${jobId}-${template.id}`,
        company: template.company,
        title: template.title.replace("{job}", jobName),
        location: template.location,
        experienceLabel: experienceLabel(template),
        salaryMin,
        salaryMax,
        gapMin: myGrossAnnual === null ? null : salaryMin - myGrossAnnual,
        gapMax: myGrossAnnual === null ? null : salaryMax - myGrossAnnual,
        tags: template.tags,
        brand: template.brand,
      };
    })
    .sort((a, b) =>
      myGrossAnnual === null
        ? b.salaryMax - a.salaryMax
        : (b.gapMax ?? 0) - (a.gapMax ?? 0),
    )
    // 정렬이 끝난 뒤 배정해야 화면에 보이는 카드끼리 같은 사진이 겹치지 않는다.
    // 시작 위치는 직무별로 달라지도록 해서 직무를 바꾸면 조합도 바뀐다.
    .map((position, index) => ({
      ...position,
      thumbnail: thumbnailFor(jobId, index),
    }));
}

export const SALARY_DATA_META = {
  sourceLabel: "최근 6개월 공고 기반 · 2026.07 갱신",
  methodLines: [
    "원티드 채용공고에 등록된 직무, 요구 경력, 연봉 정보를 바탕으로 집계한 추정값이에요.",
    "실제 지급 연봉과 차이가 있을 수 있으며, 중앙 예상 연봉과 25~75% 구간은 직무·연차별 보상 수준을 비교하기 위한 참고 정보예요.",
    "모든 금액은 세전 연봉 기준이에요.",
  ],
} as const;

export function formatManwon(manwon: number): string {
  if (Math.abs(manwon) >= 10000) {
    const sign = manwon < 0 ? "-" : "";
    const abs = Math.abs(manwon);
    const eok = Math.floor(abs / 10000);
    const rest = abs % 10000;

    return rest === 0
      ? `${sign}${eok}억원`
      : `${sign}${eok}억 ${rest.toLocaleString("ko-KR")}만원`;
  }

  return `${manwon.toLocaleString("ko-KR")}만원`;
}

/** 축 라벨처럼 좁은 자리에 쓰는 축약 표기. */
export function formatManwonShort(manwon: number): string {
  return manwon.toLocaleString("ko-KR");
}

/** `7,000~9,000만원` 처럼 단위를 뒤에 한 번만 붙이는 범위 표기. */
export function formatManwonRange(
  min: number,
  max: number,
  separator = "~",
): string {
  return `${formatManwonShort(min)}${separator}${formatManwonShort(max)}만원`;
}
