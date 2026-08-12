import styles from './Skeleton.module.css';

// Shimmer placeholder used while data loads.
export default function Skeleton({ variant = 'text', width, height, radius, count = 1, style }) {
  const items = Array.from({ length: count });
  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${styles[variant]}`}
          style={{ width, height, borderRadius: radius, ...style }}
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.skeleton} ${styles.cardImage}`} />
      <div className={styles.cardBody}>
        <div className={`${styles.skeleton} ${styles.cardTitle}`} />
        <div className={`${styles.skeleton} ${styles.cardLine}`} />
        <div className={`${styles.skeleton} ${styles.cardLineShort}`} />
      </div>
    </div>
  );
}
