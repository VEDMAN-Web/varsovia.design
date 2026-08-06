"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefCallback,
} from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import FadeInView from "@/components/company/FadeInView";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import {
  QAS_SUPPORT_COPY,
  QAS_SUPPORT_GRID,
  QAS_SUPPORT_GRID_STYLE,
  QAS_SUPPORT_ILLUSTRATION,
  QAS_SUPPORT_ROW,
  QAS_SUPPORT_SPINE_CELL,
  QAS_SUPPORT_SPINE_TRACK,
  QAS_SUPPORT_STEP_BODY,
  QAS_SUPPORT_STEP_DOT,
  QAS_SUPPORT_STEP_LABEL,
  QAS_SUPPORT_STEP_LIST,
  QAS_SUPPORT_STEP_TITLE,
  QAS_SUPPORT_WRAP,
} from "@/components/company/qualitySupportLayoutShared";
import { companyTransition } from "@/components/company/companyLayoutShared";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { DEFAULT_SITE_IMAGE_PATHS } from "@/lib/defaultSiteImages";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import { getLocaleOrDefault } from "@/lib/i18n/messageCatalog";
import { pickSiteCopy } from "@/lib/i18n/pickLocalized";
import type { Locale } from "@/lib/i18n/routing";

const EASE = [0.22, 1, 0.36, 1] as const;

const SUPPORT_KEYS = ["support1Image", "support2Image", "support3Image", "support4Image"] as const;

function SupportStepArt({
  src,
  jpgFallback,
  className,
  onLayout,
}: {
  src: string;
  jpgFallback: string;
  className?: string;
  onLayout?: () => void;
}) {
  const [current, setCurrent] = useState<string>(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={current}
      src={current}
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
      onLoad={onLayout}
      onError={() => {
        setCurrent((prev) => {
          if (prev.endsWith(".jpg")) return prev;
          if (prev !== jpgFallback) return jpgFallback;
          return prev;
        });
      }}
    />
  );
}

type SpineLine = { top: number; height: number; left: number };

type StepItem = {
  step: string;
  title: string;
  text: string;
  imageRight: boolean;
  artIndex: number;
  src: string;
  jpgFallback: string;
};

function SupportStepSpine({ dotRef }: { dotRef: RefCallback<HTMLDivElement> }) {
  return (
    <div className={QAS_SUPPORT_SPINE_CELL}>
      <div ref={dotRef} className="relative flex h-full w-full items-center justify-center">
        <motion.div
          className={QAS_SUPPORT_STEP_DOT}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ ...companyTransition, delay: 0.04 }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function SupportContinuousSpine({ line }: { line: SpineLine | null }) {
  if (!line || line.height <= 1) return null;

  return (
    <div
      className={QAS_SUPPORT_SPINE_TRACK}
      style={{ top: line.top, height: line.height, left: line.left }}
      aria-hidden
    />
  );
}

function SupportProcessStep({
  item,
  stepLabel,
  dotRef,
  onArtLayout,
}: {
  item: StepItem;
  stepLabel: string;
  dotRef: RefCallback<HTMLDivElement>;
  onArtLayout: () => void;
}) {
  const slideArt = item.imageRight ? 24 : -24;
  const slideCopy = item.imageRight ? -20 : 20;

  const illustration = (
    <motion.div
      initial={{ opacity: 0, x: slideArt }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.04 }}
      className={`${QAS_SUPPORT_ILLUSTRATION} mx-auto min-h-[120px] md:mx-0 ${item.imageRight ? "md:ml-auto" : "md:mr-auto"}`}
    >
      <SupportStepArt
        src={item.src}
        jpgFallback={item.jpgFallback}
        className="h-auto w-full object-contain"
        onLayout={onArtLayout}
      />
    </motion.div>
  );

  const copy = (
    <motion.div
      initial={{ opacity: 0, x: slideCopy }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
      className={`${QAS_SUPPORT_COPY} ${item.imageRight ? "md:ml-auto md:text-right" : "md:mr-auto md:text-left"}`}
    >
      <span className={QAS_SUPPORT_STEP_LABEL}>{stepLabel}</span>
      <h4 className={QAS_SUPPORT_STEP_TITLE}>{item.title}</h4>
      <p className={`${QAS_SUPPORT_STEP_BODY} ${item.imageRight ? "md:ml-auto" : ""}`}>{item.text}</p>
    </motion.div>
  );

  const left = item.imageRight ? copy : illustration;
  const right = item.imageRight ? illustration : copy;

  return (
    <div className={QAS_SUPPORT_ROW} style={QAS_SUPPORT_GRID_STYLE}>
      <div className={QAS_SUPPORT_GRID}>
        <div className="hidden min-w-0 items-center justify-end self-center pr-1 md:flex lg:pr-2">{left}</div>
        <SupportStepSpine dotRef={dotRef} />
        <div className="col-start-2 min-w-0 self-center md:col-start-3">
          <div className="flex flex-col gap-4 md:hidden">
            {illustration}
            {copy}
          </div>
          <div className="hidden min-w-0 items-center justify-start pl-1 md:flex lg:pl-2">{right}</div>
        </div>
      </div>
    </div>
  );
}

export default function QualitySupportProcessSection() {
  const t = useTranslations("qualitySale");
  const locale = useLocale();
  const loc = getLocaleOrDefault(locale as Locale);
  const site = useSiteSettings();
  const listRef = useRef<HTMLDivElement>(null);
  const dotEls = useRef<(HTMLDivElement | null)[]>([]);
  const [spineLine, setSpineLine] = useState<SpineLine | null>(null);

  const supportSteps = useMemo(() => {
    const cms = (site?.qualitySale || {}) as Record<string, unknown>;
    const pick = (key: string, fallback: string) =>
      pickSiteCopy(cms[key], loc, fallback) || fallback;
    return (["step1", "step2", "step3", "step4"] as const).map((key, index) => {
      const cmsKey = SUPPORT_KEYS[index];
      const defaultPng = DEFAULT_SITE_IMAGE_PATHS.qualitySupportImages[index];
      const defaultJpg = DEFAULT_SITE_IMAGE_PATHS.qualitySupportJpgFallbacks[index];
      const imageRaw = cms[cmsKey];
      return {
        step: String(index + 1).padStart(2, "0"),
        title: pick(`${key}Title`, t(`${key}Title`)),
        text: pick(`${key}Desc`, t(`${key}Desc`)),
        imageRight: index % 2 === 1,
        artIndex: index,
        src: resolveMediaUrl(
          typeof imageRaw === "string" ? imageRaw : "",
          defaultPng,
        ),
        jpgFallback: defaultJpg,
      };
    });
  }, [t, site?.qualitySale, loc]);

  const sectionTitle = useMemo(() => {
    const cms = (site?.qualitySale || {}) as Record<string, unknown>;
    return {
      title: pickSiteCopy(cms.supportTitle, loc, t("supportTitle")) || t("supportTitle"),
      subtitle:
        pickSiteCopy(cms.supportSubtitle, loc, t("supportSubtitle")) || t("supportSubtitle"),
    };
  }, [site?.qualitySale, loc, t]);

  const measureSpine = useCallback(() => {
    const list = listRef.current;
    const dots = dotEls.current.filter(Boolean) as HTMLDivElement[];
    if (!list || dots.length < 2) return;

    const first = dots[0];
    const last = dots[dots.length - 1];
    const listRect = list.getBoundingClientRect();
    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();
    const firstCenterY = firstRect.top + firstRect.height / 2;
    const lastCenterY = lastRect.top + lastRect.height / 2;
    const top = firstCenterY - listRect.top;
    const height = lastCenterY - firstCenterY;
    const left = firstRect.left + firstRect.width / 2 - listRect.left;

    setSpineLine({ top, height, left });
  }, []);

  useLayoutEffect(() => {
    measureSpine();
    const list = listRef.current;
    if (!list) return;

    const ro = new ResizeObserver(() => measureSpine());
    ro.observe(list);
    dotEls.current.forEach((el) => {
      if (el) ro.observe(el);
    });
    window.addEventListener("resize", measureSpine);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureSpine);
    };
  }, [measureSpine, supportSteps]);

  const setDotRef = useCallback(
    (index: number): RefCallback<HTMLDivElement> =>
      (node) => {
        dotEls.current[index] = node;
        requestAnimationFrame(measureSpine);
      },
    [measureSpine],
  );

  return (
    <section className="pt-2 md:pt-4">
      <CompanySectionHeading
        title={sectionTitle.title}
        subtitle={sectionTitle.subtitle}
        subtitleSentenceCase={false}
        className="mb-[clamp(1.5rem,4vw,2.5rem)]"
      />

      <div className={QAS_SUPPORT_WRAP}>
        <div ref={listRef} className={QAS_SUPPORT_STEP_LIST}>
          <SupportContinuousSpine line={spineLine} />

          {supportSteps.map((item, i) => (
            <FadeInView key={item.step} delay={i * 0.03}>
              <SupportProcessStep
                item={item}
                stepLabel={t("stepLabel", { step: item.step })}
                dotRef={setDotRef(i)}
                onArtLayout={measureSpine}
              />
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
