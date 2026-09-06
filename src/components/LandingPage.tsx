import { useEffect, useRef } from "react";
import trustLogo from "../assets/trustlogo.png";

type LandingPageProps = {
  email: string;
  onComplete: () => void;
};

const INK_PATH = "M55 108 C245 95 410 112 555 102 C720 91 875 111 1050 101";
const WORDMARK_TEXT = "Digital Opportunities Team @ HDFT";

export default function LandingPage({ onComplete }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const bugRef = useRef<HTMLDivElement>(null);
  const logoBugRef = useRef<HTMLDivElement>(null);
  const inkPathRef = useRef<SVGPathElement>(null);
  const revealRectRef = useRef<SVGRectElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  let lastParticle = 0;

  const createParticle = (x: number, y: number) => {
    if (!stageRef.current) return;
    const particle = document.createElement("div");
    const size = (3 + Math.random() * 5) + "px";
    const dx = -15 + Math.random() * 30;
    const dy = -25 - Math.random() * 25;
    
    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size};
      height: ${size};
      border-radius: 50%;
      background: radial-gradient(circle, #fff 0 20%, #41c7ed 30% 55%, transparent 72%);
      box-shadow: 0 0 9px #41c7ed;
      pointer-events: none;
      --dx: ${dx}px;
      --dy: ${dy}px;
    `;
    
    stageRef.current!.appendChild(particle);
    particle.animate([
      { opacity: "0", transform: "scale(0.25)" },
      { opacity: "1", offset: 0.2 },
      { opacity: "0", transform: `translate(var(--dx), var(--dy)) scale(1.15)` }
    ], { duration: 900, easing: "ease-out" });
    
    setTimeout(() => particle.remove(), 900);
  };

  useEffect(() => {
    const duration = 8600;
    const delay = 600;
    let start: number | null = null;

    const placeBug = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      const p = Math.max(0, Math.min(1, (elapsed - delay) / duration));

      if (!inkPathRef.current || !svgRef.current || !bugRef.current || !revealRectRef.current) return;

      const len = inkPathRef.current.getTotalLength();
      const pt = inkPathRef.current.getPointAtLength(len * p);
      const next = inkPathRef.current.getPointAtLength(Math.min(len, len * p + 2));

      const svg = svgRef.current;
      const r = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      
      const x = ((pt.x - vb.x) / vb.width) * r.width;
      const y = ((pt.y - vb.y) / vb.height) * r.height;

      // Update reveal rectangle width (1106 is SVG viewBox width)
      revealRectRef.current.setAttribute("width", String(1106 * p));

      bugRef.current.style.left = x + "px";
      bugRef.current.style.top = y + "px";
      bugRef.current.style.rotate = (Math.atan2(next.y - pt.y, next.x - pt.x) * (180 / Math.PI) + 90) + "deg";

      if (elapsed > delay && t - lastParticle > 85 && p < 1) {
        createParticle(r.left + x, r.top + y);
        lastParticle = t;
      }

      if (p < 1) {
        animationRef.current = requestAnimationFrame(placeBug);
      } else {
        // Transition to logo phase
        if (containerRef.current) {
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.classList.add("logo");
            }
          }, 1400);
        }
      }
    };

    animationRef.current = requestAnimationFrame(placeBug);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleComplete = () => {
    if (containerRef.current) {
      containerRef.current.classList.add("leaving");
    }
    setTimeout(onComplete, 650);
  };

  return (
    <div
      ref={containerRef}
      className="landing"
      style={{
        position: "fixed",
        inset: 0,
        isolation: "isolate",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        color: "#fff",
        background: `radial-gradient(circle at 75% 22%, rgb(65 199 237 / 0.28), transparent 28rem),
                     radial-gradient(circle at 12% 78%, rgb(127 228 244 / 0.18), transparent 30rem),
                     linear-gradient(145deg, #002f5f, #005eb8 52%, #0879c9)`,
        transition: "opacity 0.65s, transform 0.65s, visibility 0.65s",
        zIndex: 1000,
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -2,
          opacity: 0.16,
          backgroundImage: `linear-gradient(rgb(255 255 255 / 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgb(255 255 255 / 0.15) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(transparent, #000 25%, #000 70%, transparent)",
        }}
      />

      {/* Glowing orbs */}
      <span
        style={{
          position: "absolute",
          width: "18rem",
          height: "18rem",
          top: "8%",
          left: "7%",
          borderRadius: "50%",
          background: "rgb(65 199 237 / 0.45)",
          filter: "blur(10px)",
          opacity: 0.35,
          animation: "float 9s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "absolute",
          width: "25rem",
          height: "25rem",
          right: "2%",
          bottom: "3%",
          borderRadius: "50%",
          background: "rgb(255 255 255 / 0.16)",
          filter: "blur(10px)",
          opacity: 0.35,
          animation: "float 9s ease-in-out infinite",
          animationDelay: "-3s",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          padding: "clamp(1.2rem, 3vw, 2.5rem) clamp(1.2rem, 5vw, 5rem)",
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              color: "rgb(255 255 255 / 0.82)",
              fontSize: "clamp(0.72rem, 1.2vw, 0.95rem)",
              fontWeight: 650,
              letterSpacing: "0.045em",
              textTransform: "uppercase",
            }}
          >
            Harrogate and District NHS Foundation Trust
          </div>
          <img
            src={trustLogo}
            alt="Harrogate and District NHS Foundation Trust Logo"
            style={{
              height: "clamp(2rem, 4vw, 3rem)",
              width: "auto",
              opacity: 0.95,
            }}
          />
        </div>
        <button
          onClick={handleComplete}
          style={{
            border: "1px solid rgb(255 255 255 / 0.38)",
            padding: "0.68rem 1rem",
            borderRadius: "999px",
            color: "#fff",
            background: "rgb(0 28 53 / 0.2)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            fontSize: "inherit",
            fontWeight: 600,
            transition: "0.18s",
          }}
          onMouseEnter={(e) => {
            const btn = e.target as HTMLElement;
            btn.style.color = "#002f5f";
            btn.style.background = "#fff";
          }}
          onMouseLeave={(e) => {
            const btn = e.target as HTMLElement;
            btn.style.color = "#fff";
            btn.style.background = "rgb(0 28 53 / 0.2)";
          }}
        >
          Skip introduction
        </button>
      </header>

      {/* Main content */}
      <main
        style={{
          display: "grid",
          placeItems: "center",
          padding: "1rem clamp(1rem, 4vw, 4rem)",
        }}
      >
        {/* Intro phase */}
        <div
          ref={introRef}
          className="intro"
          style={{
            gridArea: "1/1",
            width: "min(94vw, 1180px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            transition: "0.9s cubic-bezier(0.22, 1, 0.36, 1)",
            opacity: 1,
            visibility: "visible",
          }}
        >
          <p
            style={{
              margin: "0 0 1.2rem",
              color: "rgb(255 255 255 / 0.74)",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
            }}
          >
            Welcome to
          </p>

          <div
            ref={stageRef}
            style={{
              position: "relative",
              width: "min(94vw, 1106px)",
              height: "clamp(125px, 18vw, 205px)",
              display: "flex",
              alignItems: "center",
              marginBottom: "1.2rem",
            }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 1106 180"
              style={{
                width: "100%",
                height: "auto",
                overflow: "visible",
              }}
            >
              <defs>
                <filter id="textGlow" x="-20%" y="-50%" width="140%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <clipPath id="writingReveal">
                  <rect ref={revealRectRef} x="0" y="0" width="0" height="180" />
                </clipPath>
              </defs>
              
              {/* Shadow text */}
              <text
                x="553"
                y="108"
                textAnchor="middle"
                style={{
                  fontFamily: "'Segoe Script', 'Bradley Hand', cursive",
                  fontSize: "62px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  fill: "rgb(255 255 255 / 0.12)",
                }}
              >
                {WORDMARK_TEXT}
              </text>

              {/* Ink text with reveal animation */}
              <text
                x="553"
                y="108"
                textAnchor="middle"
                clipPath="url(#writingReveal)"
                filter="url(#textGlow)"
                style={{
                  fontFamily: "'Segoe Script', 'Bradley Hand', cursive",
                  fontSize: "62px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  fill: "#fff",
                }}
              >
                {WORDMARK_TEXT}
              </text>

              {/* Guide path for ladybird */}
              <path ref={inkPathRef} d={INK_PATH} style={{ fill: "none", stroke: "transparent" }} />
            </svg>

            {/* Ladybird */}
            <div
              ref={bugRef}
              style={{
                position: "absolute",
                width: "clamp(2.7rem, 5.5vw, 4.8rem)",
                height: "clamp(2.7rem, 5.5vw, 4.8rem)",
                opacity: 0,
                filter: "drop-shadow(0 6px 5px rgb(0 20 40 / 0.36))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "inherit",
              }}
            >
              🐞
            </div>
          </div>

          <p
            style={{
              margin: "1.2rem 0 0",
              color: "rgb(255 255 255 / 0.78)",
              fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
              letterSpacing: "0.035em",
              opacity: 0,
              animation: "reveal 0.7s ease 5s forwards",
            }}
          >
            Creating practical digital solutions together
          </p>
        </div>

        {/* Logo phase */}
        <div
          ref={logoRef}
          className="identity"
          style={{
            gridArea: "1/1",
            textAlign: "center",
            opacity: 0,
            visibility: "hidden",
            transform: "translateY(2rem) scale(0.92)",
            transition: "0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0.85,
              filter: "drop-shadow(0 12px 28px rgb(0 28 53 / 0.25))",
              marginBottom: "1.2rem",
            }}
          >
            <span
              style={{
                fontSize: "clamp(6.5rem, 18vw, 13rem)",
                fontWeight: 800,
                letterSpacing: "-0.08em",
              }}
            >
              D
            </span>

            <div
              style={{
                position: "relative",
                width: "clamp(5.8rem, 15vw, 11rem)",
                height: "clamp(5.8rem, 15vw, 11rem)",
                margin: "0 clamp(0.4rem, 1.4vw, 1rem)",
                border: "clamp(0.6rem, 1.7vw, 1.2rem) solid rgb(255 255 255 / 0.95)",
                borderRadius: "50%",
                boxShadow: "0 0 38px rgb(65 199 237 / 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Orbit ring */}
              <div
                style={{
                  position: "absolute",
                  inset: "-0.65rem",
                  border: "2px dashed rgb(127 228 244 / 0.4)",
                  borderRadius: "50%",
                  animation: "spin 14s linear infinite",
                }}
              />

              {/* Logo bug */}
              <div
                ref={logoBugRef}
                style={{
                  fontSize: "clamp(2.7rem, 6vw, 4.8rem)",
                  animation: "logoBug 2.5s ease-in-out infinite",
                }}
              >
                🐞
              </div>
            </div>

            <span
              style={{
                fontSize: "clamp(6.5rem, 18vw, 13rem)",
                fontWeight: 800,
                letterSpacing: "-0.08em",
              }}
            >
              T
            </span>
          </div>

          <p
            style={{
              margin: "1.2rem 0 0",
              color: "rgb(255 255 255 / 0.86)",
              fontSize: "clamp(1rem, 2vw, 1.35rem)",
              letterSpacing: "0.14em",
            }}
          >
            Discover. Design. Deliver.
          </p>

          <button
            onClick={handleComplete}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.7rem",
              maxWidth: "min(92vw, 42rem)",
              marginTop: "1.8rem",
              padding: "0.95rem 1.6rem",
              textAlign: "center",
              lineHeight: 1.4,
              whiteSpace: "normal",
              border: "1px solid #fff",
              borderRadius: "8px",
              color: "#002f5f",
              background: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 12px 28px rgb(0 28 53 / 0.2)",
              transition: "0.2s",
              fontSize: "inherit",
            }}
            onMouseEnter={(e) => {
              const btn = e.target as HTMLElement;
              btn.style.color = "#fff";
              btn.style.background = "#002f5f";
              btn.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const btn = e.target as HTMLElement;
              btn.style.color = "#002f5f";
              btn.style.background = "#fff";
              btn.style.transform = "none";
            }}
          >
            Welcome to your Oncology Health and Treatment Assessment, click here to begin{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.7rem",
          padding: "1rem 1.5rem 1.6rem",
          color: "rgb(255 255 255 / 0.58)",
          fontSize: "clamp(0.65rem, 1.1vw, 0.82rem)",
          zIndex: 5,
        }}
      >
        <span>Digital innovation at HDFT</span>
        <div
          style={{
            width: "0.3rem",
            height: "0.3rem",
            borderRadius: "50%",
            background: "#41c7ed",
            boxShadow: "0 0 8px #41c7ed",
          }}
        />
        <span>Powered by people and ideas</span>
      </footer>

      <style>{`
        .landing {
          --blue: #005eb8;
          --deep: #002f5f;
          --dark: #001c35;
          --cyan: #41c7ed;
          --aqua: #7fe4f4;
        }

        .landing.leaving {
          opacity: 0;
          visibility: hidden;
          transform: scale(1.025);
        }

        .landing.logo .intro {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-2rem) scale(0.96);
        }

        .landing.logo .identity {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }

        @keyframes reveal {
          to { opacity: 1; }
        }

        @keyframes float {
          50% { transform: translate(1.5rem, -1rem) scale(1.08); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes logoBug {
          50% { transform: translateY(-0.55rem) rotate(-8deg); }
        }

        @media (max-width: 600px) {
          header {
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>
    </div>
  );
}
