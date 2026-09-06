import { useEffect, useRef } from "react";
import trustLogo from "../assets/trustlogo.png";

type LandingPageProps = {
  email: string;
  onComplete: () => void;
};

export default function LandingPage({ email, onComplete }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    const svgPath = svgPathRef.current;
    if (!canvas || !svg || !svgPath) return;

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
    
    // Get SVG path length
    const pathLength = svgPath.getTotalLength();
    
    // Create a transform function to convert SVG coordinates to canvas coordinates
    const getSVGPathPoint = (progress: number) => {
      const distance = pathLength * progress;
      const point = svgPath.getPointAtLength(distance);
      
      // Get next point to calculate angle
      const nextDistance = Math.min(pathLength, distance + 5);
      const nextPoint = svgPath.getPointAtLength(nextDistance);
      
      // Calculate angle from current point to next point
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      
      // The SVG viewBox is 0 0 1105.765 85 - actual text path coordinates
      const svgWidth = 1105.765;
      const svgHeight = 85;
      
      // Map SVG coordinates to canvas coordinates
      // Scale to fill the canvas width and position in middle third
      const middleThirdCenter = canvas.height / 2;
      const textY = middleThirdCenter - 60;
      
      const canvasX = (point.x / svgWidth) * canvas.width;
      // Scale Y coordinates from SVG (0-85) to canvas positioning
      // Center the text vertically around textY
      const canvasY = textY + (point.y - svgHeight / 2) * 0.8;
      
      return { x: canvasX, y: canvasY, angle };
    };

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
        // Walking phase - ladybird walks along the actual text path
        const walkProgress = progress / 0.75;
        
        // Draw the full text
        ctx!.font = `bold italic ${mainFontSize}px Brush Script MT, cursive`;
        ctx!.fillStyle = "#ffffff";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "top";
        ctx!.fillText(text, centerX, textY);
        
        // Get ladybird position and angle from SVG text path
        const pathData = getSVGPathPoint(walkProgress);
        
        // Scale ladybird size slightly based on progress for better effect
        const ladybirdSize = 35 - walkProgress * 5;
        
        drawLadybird(pathData.x, pathData.y, ladybirdSize, pathData.angle);
      } else {
        // Circling phase
        ctx!.font = `bold italic ${mainFontSize}px Brush Script MT, cursive`;
        ctx!.fillStyle = "#ffffff";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "top";
        ctx!.fillText(text, centerX, textY);
        
        // Draw DOT below the main text, centered
        const dotY = textY + mainFontSize + 50;
        ctx!.font = `bold italic ${mainFontSize + 30}px Brush Script MT, cursive`;
        ctx!.fillText(dotText, centerX, dotY);
        
        // Ladybird circles around the O in DOT and settles in the middle
        const circleProgress = (progress - 0.75) / 0.25;
        
        // Position the O center
        const oWidth = ctx!.measureText("D").width;
        const oCenterX = centerX + oWidth * 0.15;
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
      {/* Hidden SVG for path animation - uses actual text path */}
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          visibility: "hidden",
        }}
        viewBox="0 0 1105.765 85"
      >
        {/* Path traces the outline of "Digital Opportunities Team @ HDFT" text */}
        <path
          ref={svgPathRef}
          d="M 867.68 62.135 L 868.19 62.815 Q 864.96 66.47 860.115 68.978 Q 855.27 71.485 848.98 71.485 Q 842.605 71.485 838.61 68.935 Q 834.615 66.385 832.745 62.305 Q 830.875 58.225 830.875 53.72 Q 830.875 48.875 832.83 44.2 Q 834.785 39.525 838.398 35.785 Q 842.01 32.045 846.983 29.835 Q 851.955 27.625 857.99 27.625 Q 864.195 27.625 868.148 29.878 Q 872.1 32.13 874.013 35.658 Q 875.925 39.185 875.925 43.01 Q 875.925 46.155 874.778 49.215 Q 873.63 52.275 871.59 54.825 Q 869.55 57.375 866.873 58.905 Q 864.195 60.435 861.135 60.435 Q 858.33 60.435 857.013 59.075 Q 855.695 57.715 855.695 55.42 Q 855.695 54.91 855.738 54.528 Q 855.78 54.145 855.865 53.72 Q 852.975 57.63 850.128 59.628 Q 847.28 61.625 844.73 61.625 Q 842.605 61.625 841.16 60.223 Q 839.715 58.82 839.715 56.015 Q 839.715 52.955 841.373 49.343 Q 843.03 45.73 845.835 42.5 Q 848.64 39.27 851.955 37.188 Q 855.27 35.105 858.585 35.105 Q 861.22 35.105 863.005 36.508 Q 864.79 37.91 864.79 40.205 Q 864.79 41.31 864.365 41.948 Q 863.94 42.585 863.175 42.84 Q 862.41 43.095 861.39 43.095 Q 861.56 42.585 861.645 41.948 Q 861.73 41.31 861.73 40.8 Q 861.73 39.185 861.008 38.08 Q 860.285 36.975 858.5 36.975 Q 856.12 36.975 853.613 39.015 Q 851.105 41.055 849.023 44.115 Q 846.94 47.175 845.665 50.405 Q 844.39 53.635 844.39 56.1 Q 844.39 57.545 844.9 58.183 Q 845.41 58.82 846.26 58.82 Q 847.875 58.82 849.83 57.248 Q 851.785 55.675 853.783 53.253 Q 855.78 50.83 857.523 48.323 Q 859.265 45.815 860.54 44.03 Q 861.22 44.115 862.24 44.54 Q 863.26 44.965 863.26 45.73 Q 863.26 46.495 862.283 48.11 Q 861.305 49.725 860.328 51.638 Q 859.35 53.55 859.35 55.335 Q 859.35 56.185 859.86 57.163 Q 860.37 58.14 862.24 58.14 Q 864.96 58.14 867.468 55.973 Q 869.975 53.805 871.59 50.448 Q 873.205 47.09 873.205 43.52 Q 873.205 40.29 871.633 37.23 Q 870.06 34.17 866.745 32.173 Q 863.43 30.175 857.99 30.175 Q 852.55 30.175 848.13 32.258 Q 843.71 34.34 840.523 37.825 Q 837.335 41.31 835.635 45.518 Q 833.935 49.725 833.935 54.06 Q 833.935 57.885 835.465 61.37 Q 836.995 64.855 840.438 67.108 Q 843.88 69.36 849.49 69.36 Q 853.995 69.36 858.713 67.618 Q 863.43 65.875 867.68 62.135 Z M 9.095 68.595 Q 6.46 68.595 4.08 67.873 Q 1.7 67.15 0 64.77 Q 0.85 60.69 2.083 55.973 Q 3.315 51.255 4.76 46.283 Q 6.205 41.31 7.693 36.508 Q 9.18 31.705 10.54 27.54 Q 11.9 23.375 13.005 20.23 Q 14.11 17.085 14.705 15.47 Q 14.96 14.79 15.555 13.473 Q 16.15 12.155 17 10.795 Q 17.85 9.435 18.955 8.458 Q 20.06 7.48 21.335 7.48 Q 22.525 7.48 23.715 8.33 Q 21.08 14.45 18.403 21.845 Q 15.725 29.24 13.26 37.103 Q 10.795 44.965 8.755 52.445 Q 6.715 59.925 5.355 66.045 Q 6.545 66.215 7.353 66.3 Q 8.16 66.385 9.01 66.385 Q 14.45 66.385 19.508 63.878 Q 24.565 61.37 28.943 56.993 Q 33.32 52.615 36.635 46.963 Q 39.95 41.31 41.778 34.978 Q 43.605 28.645 43.605 22.355 Q 43.605 15.47 41.395 11.008 Q 39.185 6.545 35.275 4.42 Q 31.365 2.295 26.18 2.295 Q 20.655 2.295 16.235 4.505 Q 11.815 6.715 9.265 10.455 Q 6.715 14.195 6.715 18.87 Q 6.715 19.89 6.843 20.655 Q 6.97 21.42 7.14 22.015 Q 4.335 22.015 3.188 20.613 Q 2.04 19.21 2.04 17.255 Q 2.04 14.28 4.123 11.263 Q 6.205 8.245 9.903 5.695 Q 13.6 3.145 18.445 1.573 Q 23.29 0 28.73 0 Q 36.38 0 41.013 3.103 Q 45.645 6.205 47.77 11.475 Q 49.895 16.745 49.895 23.29 Q 49.895 30.685 47.6 37.443 Q 45.305 44.2 41.268 49.853 Q 37.23 55.505 32.045 59.713 Q 26.86 63.92 20.953 66.258 Q 15.045 68.595 9.095 68.595 Z M 967.47 68.595 Q 964.835 68.595 962.455 67.873 Q 960.075 67.15 958.375 64.77 Q 959.225 60.69 960.458 55.973 Q 961.69 51.255 963.135 46.283 Q 964.58 41.31 966.068 36.508 Q 967.555 31.705 968.915 27.54 Q 970.275 23.375 971.38 20.23 Q 972.485 17.085 973.08 15.47 Q 973.335 14.79 973.93 13.473 Q 974.525 12.155 975.375 10.795 Q 976.225 9.435 977.33 8.458 Q 978.435 7.48 979.71 7.48 Q 980.9 7.48 982.09 8.33 Q 979.455 14.45 976.778 21.845 Q 974.1 29.24 971.635 37.103 Q 969.17 44.965 967.13 52.445 Q 965.09 59.925 963.73 66.045 Q 964.92 66.215 965.728 66.3 Q 966.535 66.385 967.385 66.385 Q 972.825 66.385 977.883 63.878 Q 982.94 61.37 987.318 56.993 Q 991.695 52.615 995.01 46.963 Q 998.325 41.31 1000.153 34.978 Q 1001.98 28.645 1001.98 22.355 Q 1001.98 15.47 999.77 11.008 Q 997.56 6.545 993.65 4.42 Q 989.74 2.295 984.555 2.295 Q 979.03 2.295 974.61 4.505 Q 970.19 6.715 967.64 10.455 Q 965.09 14.195 965.09 18.87 Q 965.09 19.89 965.218 20.655 Q 965.345 21.42 965.515 22.015 Q 962.71 22.015 961.563 20.613 Q 960.415 19.21 960.415 17.255 Q 960.415 14.28 962.498 11.263 Q 964.58 8.245 968.278 5.695 Q 971.975 3.145 976.82 1.573 Q 981.665 0 987.105 0 Q 994.755 0 999.388 3.103 Q 1004.02 6.205 1006.145 11.475 Q 1008.27 16.745 1008.27 23.29 Q 1008.27 30.685 1005.975 37.443 Q 1003.68 44.2 999.643 49.853 Q 995.605 55.505 990.42 59.713 Q 985.235 63.92 979.328 66.258 Q 973.42 68.595 967.47 68.595 Z"
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
