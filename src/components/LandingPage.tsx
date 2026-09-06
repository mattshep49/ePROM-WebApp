import { useEffect, useRef } from "react";

type LandingPageProps = {
  email: string;
  onComplete: () => void;
};

export default function LandingPage({ email, onComplete }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Animation parameters
    const startTime = Date.now();
    const animationDuration = 8000; // 8 seconds for animation

    // Text to animate
    // Ladybird shape and position
    interface LadybirdState {
      x: number;
      y: number;
      angle: number;
      size: number;
    }

    const drawLadybird = (
      x: number,
      y: number,
      size: number,
      angle: number = 0
    ) => {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(angle);

      // Body (red)
      ctx!.fillStyle = "#d5281b";
      ctx!.beginPath();
      ctx!.ellipse(0, 0, size * 0.8, size * 1.2, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Head (black)
      ctx!.fillStyle = "#000000";
      ctx!.beginPath();
      ctx!.arc(-size * 0.4, -size * 0.8, size * 0.35, 0, Math.PI * 2);
      ctx!.fill();

      // Eyes (white dots)
      ctx!.fillStyle = "#ffffff";
      ctx!.beginPath();
      ctx!.arc(-size * 0.55, -size * 0.95, size * 0.12, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(-size * 0.25, -size * 0.95, size * 0.12, 0, Math.PI * 2);
      ctx!.fill();

      // Black spots on body (left side)
      ctx!.fillStyle = "#000000";
      ctx!.beginPath();
      ctx!.arc(-size * 0.35, -size * 0.3, size * 0.15, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(-size * 0.35, size * 0.3, size * 0.15, 0, Math.PI * 2);
      ctx!.fill();

      // Black spots on body (right side)
      ctx!.beginPath();
      ctx!.arc(size * 0.35, -size * 0.3, size * 0.15, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(size * 0.35, size * 0.3, size * 0.15, 0, Math.PI * 2);
      ctx!.fill();

      // Antennae (black)
      ctx!.strokeStyle = "#000000";
      ctx!.lineWidth = size * 0.15;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(-size * 0.35, -size);
      ctx!.quadraticCurveTo(-size * 0.6, -size * 1.3, -size * 0.5, -size * 1.5);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(-size * 0.15, -size);
      ctx!.quadraticCurveTo(size * 0.1, -size * 1.3, size * 0, -size * 1.5);
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
      const centerY = canvas.height / 3;
      const textX = centerX - 350;
      const textY = centerY + 100;

      // Set up font - using system cursive font
      ctx!.font = 'bold italic 48px Brush Script MT, cursive';
      ctx!.fillStyle = "#ffffff";
      ctx!.textAlign = "left";
      ctx!.textBaseline = "top";

      if (progress < 0.7) {
        // Walking phase - ladybird walks along the text, leaving letters behind
        const walkProgress = progress / 0.7;
        
        // Calculate how many characters should be visible
        const visibleCharCount = Math.floor(walkProgress * text.length);
        const displayText = text.substring(0, visibleCharCount);
        
        // Draw the visible text
        ctx!.fillText(displayText, textX, textY);
        
        // Calculate ladybird position based on text width
        const textMetrics = ctx!.measureText(displayText);
        let ladybirdX = textX + textMetrics.width + 20;
        
        // Add smoothness between characters
        const fractionalChar = (walkProgress * text.length) % 1;
        if (visibleCharCount < text.length) {
          const nextCharText = text.substring(0, visibleCharCount + 1);
          const nextMetrics = ctx!.measureText(nextCharText);
          const charWidth = nextMetrics.width - textMetrics.width;
          ladybirdX += fractionalChar * charWidth;
        }
        
        const ladybirdY = textY - 40;
        const ladybirdAngle = Math.sin(walkProgress * Math.PI * 4) * 0.1; // Bobbing animation
        const ladybirdSize = 25;
        
        drawLadybird(ladybirdX, ladybirdY, ladybirdSize, ladybirdAngle);
      } else {
        // Circling phase - draw complete text and circle for DOT
        ctx!.fillText(text, textX, textY);
        
        const circleProgress = (progress - 0.7) / 0.3;
        const dotCenterX = centerX + 80;
        const dotCenterY = centerY + 240;
        const radius = 80;

        // Circle around the position
        const circleAngle = circleProgress * Math.PI * 2.5;
        const ladybirdX = dotCenterX + Math.cos(circleAngle) * radius;
        const ladybirdY = dotCenterY + Math.sin(circleAngle) * radius - 40;
        const ladybirdSize = 25 - circleProgress * 5; // Shrink slightly
        
        drawLadybird(ladybirdX, ladybirdY, circleAngle);
      }

      // Draw DOT text after animation
      if (progress > 0.6) {
        ctx!.fillStyle = "#ffffff";
        ctx!.font = 'bold italic 56px Brush Script MT, cursive';
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        const dotX = centerX + 80;
        const dotY = centerY + 240;
        ctx!.fillText(dotText, dotX, dotY);
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
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          zIndex: 10,
          opacity: 0,
          animation: "fadeInTitle 1s ease-out 0.5s forwards",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 700, lineHeight: 1.3, marginBottom: "10px" }}>
          Welcome {email}
        </h1>
        <p style={{ margin: 0, fontSize: "18px", fontWeight: 400, lineHeight: 1.5, opacity: 0.95 }}>
          to your Oncology Health and Treatment Questionnaire
        </p>
      </div>

      <style>{`
        @keyframes fadeInTitle {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
