
import PropTypes from 'prop-types'
import styles from './ErrorMessage.module.css'

function ErrorMessage({ message }) {
	return (
		<div className={styles['errorMessage']}>
			Ошибка: <br />
			{message}
		</div>
	)
}

ErrorMessage.propTypes = {
	message: PropTypes.string
}

export default ErrorMessage
