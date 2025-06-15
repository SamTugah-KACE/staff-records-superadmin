import styles from './SuccessView.module.css';

export default function SuccessView({ newOrgId, onRegisterAnother, onViewOrganizations }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className={styles.title}>Registration Successful!</h2>
        <p className={styles.message}>Your organization has been registered successfully.</p>
        
        <div className={styles.orgId}>
          <p className={styles.orgIdText}>Organization ID:</p>
          <p className={styles.orgIdValue}>{newOrgId}</p>
        </div>
        
        <div className={styles.actions}>
          <button 
            onClick={onRegisterAnother}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Register Another
          </button>
          <button 
            onClick={onViewOrganizations}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            View Organizations
          </button>
        </div>
      </div>
    </div>
  );
}