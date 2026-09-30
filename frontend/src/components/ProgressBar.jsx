function ProgressBar({
  value = 0,
  className = "",
}) {
  return (
    <div className={`progress-track ${className}`}>
      <div
        className="progress-fill"
        style={{
          width: `${Math.min(
            Math.max(value, 0),
            100
          )}%`,
        }}
      />
    </div>
  );
}

export default ProgressBar;