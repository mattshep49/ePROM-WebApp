import { useEffect, useRef } from "react";
import trustLogo from "../assets/trustlogo.png";

type LandingPageProps = {
  email: string;
  onComplete: () => void;
};

export default function LandingPage({ email, onComplete }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const svgPath = svgPathRef.current;
    if (!canvas || !svgPath) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Animation parameters
    const startTime = Date.now();
    const animationDuration = 8000; // 8 seconds for animation

    // Text to animate
    const text = "Digital Opportunities Team @ HDFT";
    const dotText = "DOT";
    
    // Get path length for progress calculation
    const pathLength = svgPath.getTotalLength();

    const drawLadybird = (
      x: number,
      y: number,
      size: number,
      angle: number = 0
    ) => {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(angle);

      // Wings/elytra (red body)
      ctx!.fillStyle = "#d5281b";
      ctx!.beginPath();
      ctx!.ellipse(0, 0, size * 0.85, size * 1.3, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Wing divider (center line)
      ctx!.strokeStyle = "#000000";
      ctx!.lineWidth = size * 0.08;
      ctx!.beginPath();
      ctx!.moveTo(0, -size * 1.3);
      ctx!.lineTo(0, size * 1.3);
      ctx!.stroke();

      // Black spots on body - 6 spots (3 per side)
      ctx!.fillStyle = "#000000";
      // Left side spots
      ctx!.beginPath();
      ctx!.arc(-size * 0.35, -size * 0.5, size * 0.18, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(-size * 0.35, 0, size * 0.18, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(-size * 0.35, size * 0.5, size * 0.18, 0, Math.PI * 2);
      ctx!.fill();
      // Right side spots
      ctx!.beginPath();
      ctx!.arc(size * 0.35, -size * 0.5, size * 0.18, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(size * 0.35, 0, size * 0.18, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(size * 0.35, size * 0.5, size * 0.18, 0, Math.PI * 2);
      ctx!.fill();

      // Head (black)
      ctx!.fillStyle = "#000000";
      ctx!.beginPath();
      ctx!.arc(0, -size * 1.05, size * 0.4, 0, Math.PI * 2);
      ctx!.fill();

      // Eyes (white dots)
      ctx!.fillStyle = "#ffffff";
      ctx!.beginPath();
      ctx!.arc(-size * 0.15, -size * 1.15, size * 0.1, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(size * 0.15, -size * 1.15, size * 0.1, 0, Math.PI * 2);
      ctx!.fill();

      // Mouth (black line)
      ctx!.strokeStyle = "#000000";
      ctx!.lineWidth = size * 0.08;
      ctx!.beginPath();
      ctx!.arc(0, -size * 1.05, size * 0.2, 0.2, Math.PI - 0.2);
      ctx!.stroke();

      // Antennae (black, more detailed)
      ctx!.strokeStyle = "#000000";
      ctx!.lineWidth = size * 0.12;
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      // Left antenna
      ctx!.beginPath();
      ctx!.moveTo(-size * 0.15, -size * 1.4);
      ctx!.quadraticCurveTo(-size * 0.5, -size * 1.7, -size * 0.6, -size * 1.9);
      ctx!.stroke();
      // Right antenna
      ctx!.beginPath();
      ctx!.moveTo(size * 0.15, -size * 1.4);
      ctx!.quadraticCurveTo(size * 0.5, -size * 1.7, size * 0.6, -size * 1.9);
      ctx!.stroke();

      // Legs (6 legs - black)
      ctx!.strokeStyle = "#000000";
      ctx!.lineWidth = size * 0.1;
      ctx!.lineCap = "round";
      // Front left
      ctx!.beginPath();
      ctx!.moveTo(-size * 0.6, -size * 0.6);
      ctx!.quadraticCurveTo(-size * 0.95, -size * 0.3, -size * 0.9, size * 0.2);
      ctx!.stroke();
      // Front right
      ctx!.beginPath();
      ctx!.moveTo(size * 0.6, -size * 0.6);
      ctx!.quadraticCurveTo(size * 0.95, -size * 0.3, size * 0.9, size * 0.2);
      ctx!.stroke();
      // Middle left
      ctx!.beginPath();
      ctx!.moveTo(-size * 0.7, 0);
      ctx!.quadraticCurveTo(-size * 1.1, 0, -size * 1.0, size * 0.4);
      ctx!.stroke();
      // Middle right
      ctx!.beginPath();
      ctx!.moveTo(size * 0.7, 0);
      ctx!.quadraticCurveTo(size * 1.1, 0, size * 1.0, size * 0.4);
      ctx!.stroke();
      // Back left
      ctx!.beginPath();
      ctx!.moveTo(-size * 0.6, size * 0.6);
      ctx!.quadraticCurveTo(-size * 0.95, size * 0.8, -size * 0.85, size * 1.2);
      ctx!.stroke();
      // Back right
      ctx!.beginPath();
      ctx!.moveTo(size * 0.6, size * 0.6);
      ctx!.quadraticCurveTo(size * 0.95, size * 0.8, size * 0.85, size * 1.2);
      ctx!.stroke();

      ctx!.restore();
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Clear canvas
      ctx!.fillStyle = "#003f87"; // NHS Blue
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const canvasHeight = canvas.height;
      
      // Position text in middle third of canvas
      const middleThirdCenter = canvasHeight / 2;
      const textY = middleThirdCenter - 60;
      
      // Set up font - much larger
      const mainFontSize = 96;
      ctx!.font = `bold italic ${mainFontSize}px Brush Script MT, cursive`;
      ctx!.fillStyle = "#ffffff";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "top";

      if (progress < 0.75) {
        // Walking phase - ladybird walks along the SVG path
        const walkProgress = progress / 0.75;
        
        // Calculate how many characters should be visible
        const visibleCharCount = Math.floor(walkProgress * text.length);
        const displayText = text.substring(0, visibleCharCount);
        
        // Draw the visible text
        ctx!.fillText(displayText, centerX, textY);
        
        // Get ladybird position from SVG path
        const pathProgress = walkProgress * pathLength;
        const point = svgPath!.getPointAtLength(pathProgress);
        
        // Adjust position relative to canvas
        const ladybirdX = point.x;
        const ladybirdY = point.y + textY - 50;
        const ladybirdAngle = Math.sin(walkProgress * Math.PI * 4) * 0.15;
        
        drawLadybird(ladybirdX, ladybirdY, 35, ladybirdAngle);
      } else {
        // Circling phase - draw complete text and DOT below it
        ctx!.fillText(text, centerX, textY);
        
        // Draw DOT below the main text, centered
        const dotY = textY + mainFontSize + 50;
        ctx!.font = `bold italic ${mainFontSize + 30}px Brush Script MT, cursive`;
        ctx!.fillText(dotText, centerX, dotY);
        
        // Ladybird circles around the O in DOT and settles in the middle
        const circleProgress = (progress - 0.75) / 0.25;
        
        // Position the O center (approximately where DOT's O would be)
        const oWidth = ctx!.measureText("D").width;
        const oCenterX = centerX + oWidth * 0.15; // Adjusted for O position in DOT
        const oCenterY = dotY + mainFontSize / 2;
        const radius = mainFontSize * 0.6;

        // Spiral inward as progress increases
        const spiralRadius = radius * (1 - circleProgress * 0.8);
        const circleAngle = circleProgress * Math.PI * 3;
        
        const ladybirdX = oCenterX + Math.cos(circleAngle) * spiralRadius;
        const ladybirdY = oCenterY + Math.sin(circleAngle) * spiralRadius;
        const ladybirdSize = 35 * (1 - circleProgress * 0.5);
        
        drawLadybird(ladybirdX, ladybirdY, ladybirdSize, circleAngle + Math.PI / 4);
        
        // Final position: sit in center of O
        if (circleProgress > 0.9) {
          drawLadybird(oCenterX, oCenterY, 30, 0);
        }
      }

      // Continue animation if not done
      if (elapsed < animationDuration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete, wait for 2 more seconds then transition
        setTimeout(onComplete, 2000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#003f87",
      }}
    >
      {/* Hidden SVG for path animation */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          visibility: "hidden",
        }}
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      >
        <path
          ref={svgPathRef}
          d={`M 100 ${window.innerHeight / 2} Q ${window.innerWidth / 2} ${window.innerHeight / 2 - 80} ${window.innerWidth - 100} ${window.innerHeight / 2}`}
          fill="none"
          stroke="none"
        />
      </svg>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "2%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "white",
          zIndex: 10,
          width: "90%",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, lineHeight: 1.3, marginBottom: "8px" }}>
          Welcome {email}
        </h1>
        <p style={{ margin: 0, fontSize: "16px", fontWeight: 400, lineHeight: 1.5, opacity: 0.95 }}>
          to your Oncology Health and Treatment Questionnaire
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "2%",
          left: 0,
          right: 0,
          width: "100%",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <img
          src={trustLogo}
          alt="Team HDFT - Harrogate and District NHS Foundation Trust"
          style={{
            maxWidth: "90%",
            height: "auto",
            maxHeight: "100px",
          }}
        />
      </div>

      <style>{`
        /* Animation styles here if needed */
      `}</style>
    </div>
  );
}
