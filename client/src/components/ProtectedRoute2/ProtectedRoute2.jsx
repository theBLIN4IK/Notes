import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../../store/userStore';
import styles from '../ProtectedRoute/ProtectedRoute.module.css';

function ProtectedRoute2({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = useUserStore((state) => state.checkAuth)
  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth();
      setIsAuth(authenticated);
      setLoading(false);
    }
    verifyAuth();
  }, [checkAuth])


  if (loading) {
    return(
	 <div className={styles['loader-container']}>
	<div className={styles['loader']}></div>
  </div>
  )}

  if (isAuth) {
    return <Navigate to="/main" />
  }
 

  return children;
}

ProtectedRoute2.propTypes = {
  children: PropTypes.node.isRequired,

}
export default ProtectedRoute2