"use client";

import { useId, useRef, useState } from "react";
import {
  Box,
  ContentBadge,
  FlexBox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from "@wanteddev/wds";
import { IconCircleInfo } from "@wanteddev/wds-icon";

import { SALARY_DATA_META } from "@/data/salary";
import {
  infoTriggerStyle,
  metaRowStyle,
  methodPopoverStyle,
} from "./SalaryMetaInfo.style";

const CLOSE_DELAY_MS = 160;

/**
 * `[최근 6개월 공고 · 2026.07 갱신] ⓘ` 한 줄.
 * Badge 는 비인터랙티브, 아이콘만 hover/focus/click 으로 산출 방식을 연다.
 * click 으로 열면 pin 되어 pointerleave 로는 닫히지 않는다.
 */
export function SalaryMetaInfo() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descriptionId = useId();

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openByPointer = () => {
    cancelClose();
    setOpen(true);
  };

  const closeByPointer = () => {
    if (pinned) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleOpenChange = (next: boolean) => {
    // 바깥 클릭 · Escape 로 닫히는 경우 pin 도 해제한다.
    setOpen(next);
    if (!next) setPinned(false);
  };

  return (
    <Box sx={metaRowStyle}>
      <FlexBox alignItems="center" gap="6px">
        <ContentBadge color="neutral" size="small" variant="outlined">
          {SALARY_DATA_META.sourceLabel}
        </ContentBadge>

        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger>
            <Box
              as="button"
              type="button"
              aria-label="연봉 데이터 산출 방식 확인"
              aria-describedby={open ? descriptionId : undefined}
              sx={infoTriggerStyle}
              onPointerEnter={openByPointer}
              onPointerLeave={closeByPointer}
              onFocus={openByPointer}
              onBlur={closeByPointer}
              onClick={() => {
                // PopoverTrigger 가 open(true) 을 담당하므로 여기서는 pin 만 토글한다.
                if (open && pinned) {
                  setPinned(false);
                  setOpen(false);
                } else {
                  setPinned(true);
                }
              }}
            >
              <IconCircleInfo />
            </Box>
          </PopoverTrigger>

          <PopoverContent
            id={descriptionId}
            variant="custom"
            position="bottom-start"
            sx={methodPopoverStyle}
            /* hover 로도 열리므로 열려 있는 동안 페이지가 잠기지 않게 한다. */
            disableOutsidePointerEvents={false}
            onPointerEnter={cancelClose}
            onPointerLeave={closeByPointer}
          >
            <FlexBox flexDirection="column" gap="10px">
              {SALARY_DATA_META.methodLines.map((line) => (
                <Typography key={line} variant="label1-reading">
                  {line}
                </Typography>
              ))}
            </FlexBox>
          </PopoverContent>
        </Popover>
      </FlexBox>
    </Box>
  );
}
