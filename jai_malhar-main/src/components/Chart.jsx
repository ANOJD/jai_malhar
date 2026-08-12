import { motion } from 'framer-motion';
import styles from './Chart.module.css';

// Lightweight SVG-based charts (bar, donut, line) — no external chart library.
// This keeps the bundle small and the visuals on-brand.

export function BarChart({ data, color = 'var(--color-primary)' }) {
  const max = Math.max(...data.map((d) => d.value));
  const barWidth = 100 / (data.length * 1.5);

  return (
    <div className={styles.barChart}>
      <div className={styles.barChartBars}>
        {data.map((item, i) => (
          <div key={item.label} className={styles.barCol}>
            <motion.div
              className={styles.bar}
              initial={{ height: 0 }}
              whileInView={{ height: `${(item.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: color }}
            >
              <span className={styles.barValue}>{item.value}</span>
            </motion.div>
            <span className={styles.barLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ data, size = 200 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-primary-300)', 'var(--color-text-muted)'];
  let offset = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={styles.donutChart}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--color-bg-alt)" strokeWidth="28" />
        {data.map((item, i) => {
          const dash = (item.value / total) * circumference;
          const segment = (
            <motion.circle
              key={item.name || item.status}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="28"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 100 100)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          );
          offset += dash;
          return segment;
        })}
        <text x="100" y="95" textAnchor="middle" className={styles.donutTotal}>
          {total}
        </text>
        <text x="100" y="115" textAnchor="middle" className={styles.donutLabel}>
          Total
        </text>
      </svg>
      <div className={styles.donutLegend}>
        {data.map((item, i) => (
          <div key={item.name || item.status} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: colors[i % colors.length] }} />
            <span className={styles.legendLabel}>{item.name || item.status}</span>
            <span className={styles.legendValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data, color = 'var(--color-secondary)' }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const width = 100;
  const height = 100;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d.value - min) / range) * (height - 10) - 5,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className={styles.lineChart}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.lineSvg}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaD}
          fill="url(#lineGradient)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.2"
            fill={color}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.05 }}
          />
        ))}
      </svg>
      <div className={styles.lineLabels}>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
