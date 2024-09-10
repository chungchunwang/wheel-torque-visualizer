function TorqueVisualizer({
  value,
  scale,
  name,
}: {
  value: number;
  scale: number;
  name: string;
}): JSX.Element {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "5px",
          top: "5px",
          fontSize: "10px",
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: "absolute",
          left: "15%",
          bottom: "50%",
          height: value > 0 ? `calc(${(value / scale) * 50}% - 10px)` : 0,
          width: "50%",
          backgroundColor: "green",
          borderRadius: "3px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          left: "15%",
          top: "50%",
          height: value < 0 ? `calc(${(-value / scale) * 50}% - 10px)` : 0,
          width: "50%",
          backgroundColor: "red",
          borderRadius: "3px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          left: "calc(75% + 15px)",
          top: "calc(50% - 5px)",
          fontSize: "10px",
          lineHeight: "10px",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          left: "calc(75% + 15px)",
          top: "10px",
          fontSize: "10px",
          lineHeight: "10px",
          color: "white",
        }}
      >
        {scale}
      </div>
      <div
        style={{
          position: "absolute",
          left: "calc(75% + 15px)",
          bottom: "10px",
          fontSize: "10px",
          lineHeight: "10px",
          color: "white",
        }}
      >
        -{scale}
      </div>
      <div
        style={{
          position: "absolute",
          left: "calc(75% + 5px)",
          top: "10px",
          width: "5px",
          bottom: "10px",
          backgroundColor: "white",
          borderRadius: "1px",
        }}
      ></div>
    </div>
  );
}

export default TorqueVisualizer;
