"use client";

import { useRef, useEffect, useState, useMemo } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const gsapRef = useRef<any>(null);
  const scrollTriggerRef = useRef<any>(null);
  const splitTextRef = useRef<any>(null);

  // Memoize object props to prevent unnecessary re-renders
  const fromMemo = useMemo(() => from, [JSON.stringify(from)]);
  const toMemo = useMemo(() => to, [JSON.stringify(to)]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    // Dynamically import GSAP modules only on client side
    if (typeof window !== "undefined" && !gsapLoaded) {
      Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]).then(([gsapModule, scrollTriggerModule, splitTextModule]) => {
        gsapRef.current = gsapModule.gsap;
        scrollTriggerRef.current = scrollTriggerModule.ScrollTrigger;
        splitTextRef.current = splitTextModule.SplitText;

        gsapRef.current.registerPlugin(
          scrollTriggerRef.current,
          splitTextRef.current
        );

        setGsapLoaded(true);
      });
    }
  }, [gsapLoaded]);

  useEffect(() => {
    if (!ref.current || !text || !fontsLoaded || !gsapLoaded) return;
    if (!gsapRef.current || !scrollTriggerRef.current || !splitTextRef.current)
      return;

    // Prevent animation from running multiple times
    if (hasAnimatedRef.current) return;

    const el = ref.current;
    const gsap = gsapRef.current;
    const ScrollTrigger = scrollTriggerRef.current;
    const GSAPSplitText = splitTextRef.current;

    if ((el as any)._rbsplitInstance) {
      try {
        (el as any)._rbsplitInstance.revert();
      } catch (_) {
        /* noop */
      }
      (el as any)._rbsplitInstance = null;
    }

    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
    const sign =
      marginValue === 0
        ? ""
        : marginValue < 0
        ? `-=${Math.abs(marginValue)}${marginUnit}`
        : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    let targets: any;
    const assignTargets = (self: any) => {
      if (splitType.includes("chars") && self.chars.length)
        targets = self.chars;
      if (!targets && splitType.includes("words") && self.words.length)
        targets = self.words;
      if (!targets && splitType.includes("lines") && self.lines.length)
        targets = self.lines;
      if (!targets) targets = self.chars || self.words || self.lines;
    };

    const splitInstance = new GSAPSplitText(el, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      reduceWhiteSpace: false,
      onSplit: (self: any) => {
        assignTargets(self);
        const tween = gsap.fromTo(
          targets,
          { ...fromMemo },
          {
            ...toMemo,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4,
            },
            onComplete: () => {
              animationCompletedRef.current = true;
              hasAnimatedRef.current = true;
              onLetterAnimationComplete?.();
            },
            willChange: "transform, opacity",
            force3D: true,
          }
        );
        return tween;
      },
    } as any);

    (el as any)._rbsplitInstance = splitInstance;
    hasAnimatedRef.current = true;

    return () => {
      ScrollTrigger.getAll().forEach((st: any) => {
        if (st.trigger === el) st.kill();
      });
      try {
        splitInstance.revert();
      } catch (_) {
        /* noop */
      }
      (el as any)._rbsplitInstance = null;
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    fromMemo,
    toMemo,
    threshold,
    rootMargin,
    fontsLoaded,
    gsapLoaded,
    onLetterAnimationComplete,
  ]);

  const renderTag = () => {
    const style: React.CSSProperties = {
      textAlign,
      overflow: "hidden",
      display: "inline-block",
      whiteSpace: "normal",
      wordWrap: "break-word",
      willChange: "transform, opacity",
    };
    const classes = `split-parent ${className}`;

    switch (tag) {
      case "h1":
        return (
          <h1 ref={ref as any} style={style} className={classes}>
            {text}
          </h1>
        );
      case "h2":
        return (
          <h2 ref={ref as any} style={style} className={classes}>
            {text}
          </h2>
        );
      case "h3":
        return (
          <h3 ref={ref as any} style={style} className={classes}>
            {text}
          </h3>
        );
      case "h4":
        return (
          <h4 ref={ref as any} style={style} className={classes}>
            {text}
          </h4>
        );
      case "h5":
        return (
          <h5 ref={ref as any} style={style} className={classes}>
            {text}
          </h5>
        );
      case "h6":
        return (
          <h6 ref={ref as any} style={style} className={classes}>
            {text}
          </h6>
        );
      default:
        return (
          <p ref={ref as any} style={style} className={classes}>
            {text}
          </p>
        );
    }
  };

  return renderTag();
};

export default SplitText;
