import styles from './err.module.css';

function Err() {
    return (
        <div className={styles['container']}>
      <div className={styles['title']}>
        <h1>Notes! / 404 - сраница недоступна</h1>
      </div>
      <div className={styles['form-cont']}>
     <p className={styles['text']}>404</p>
  <button className={styles['btn-back']} onClick={() => window.history.back()}>назад</button>
      </div>
      </div>
    )
}
export default Err