import styles from './Loader.module.scss';

export const LoadingIndicator = () => (
  <div className={styles['loading-container']}>
    <div className={styles['loading-dots']}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  </div>
);

export default LoadingIndicator;