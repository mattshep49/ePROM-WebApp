type Props = {
  label: string;
  value: number;
};

export default function SymptomSeverity({
  label,
  value
}: Props) {

  const percentage =
    (value / 10) * 100;

  return (
    <div
      style={{
        marginBottom: "20px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <strong>{label}</strong>

        <span>{value}/10</span>
      </div>

      <div
        style={{
          height: "16px",
          background: "#e5e5e5",
          borderRadius: "12px"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            borderRadius: "12px",
            background: "#005eb8"
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginTop: "4px"
        }}
      >
        <span>None</span>
        <span>Very Severe</span>
      </div>
    </div>
  );
}