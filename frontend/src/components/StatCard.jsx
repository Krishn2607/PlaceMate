function StatCard({
  icon,
  label,
  value,
  suffix,
  change,
  changeLabel,
  positive = true,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-label">
        {label}
      </div>

      <div className="stat-value">
        {value}

        {suffix && (
          <span className="stat-suffix">
            {suffix}
          </span>
        )}
      </div>

      {change !== undefined && (
        <div
          className={`stat-change ${
            positive ? "positive" : "neutral"
          }`}
        >
          <span>{change}</span>

          {changeLabel && (
            <span className="change-label">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;