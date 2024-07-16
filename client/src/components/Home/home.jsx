import { useState, useEffect } from 'react';
import styles from './home.module.css';
import { useUserStore } from '../../../store/userStore'; 
import { Navigate, useNavigate } from'react-router-dom';



function Home() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate()
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [verifyPass, setVerifyPass] = useState('');
  const [errorPass, setErrorPass] = useState('');

const register = useUserStore(state => state.register)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
     await register(email, password)
     setTimeout(() => {
      setHeaderText('Проверьте почту')
      setHeaderTextColor(styles['header-text-green'])
      setTimeout(() => {
        setHeaderTextColor('')
      }, 1000)
    }, 10)
    } catch (error) {
      setHeaderTextColor(styles['error-text-light'])
      setTimeout(() => {
        setHeaderText(error.message)
        setHeaderTextColor('')
      }, 600);
    }
  };
   const login = useUserStore(state => state.login)
   const handleLogin = async (e) => {
    e.preventDefault()
    try {
       await login(email, password)
       navigate('/main')
    } catch (error) {
      setHeaderTextColor(styles['error-text-light'])
      setTimeout(() => {
        setHeaderText2(error.message)
        setHeaderTextColor('')
      }, 600);
    }
  };
  


  const [showForm1, setShowForm1] = useState(true)
  const [showForm2, setShowForm2] = useState(false)
  const [headerTextColor, setHeaderTextColor] = useState('')

  const toggleForm1 = () => {
    setShowForm1(true);
    setShowForm2(false);
    setHeaderTextColor(styles['header-text-light'])
    setTimeout(() => {
      setHeaderTextColor('')
    }, 1000)
  }

  const toggleForm2 = () => {
    setShowForm1(false);
    setShowForm2(true);
    setHeaderTextColor(styles['header-text-light'])
    setTimeout(() => {
      setHeaderTextColor('')
    }, 1000)
  };
  const [headerText, setHeaderText] = useState('Регистрация')
  const [headerText2, setHeaderText2] = useState('Вход')


 
  useEffect(() => {
    function isValidEmail(emaail) {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      return emailRegex.test(emaail)
    }

    if (isValidEmail(email)) {
      setVerifyEmail('Email валиден')
      setErrorEmail('')
    } else if (!isValidEmail(email) && email !== '') {
      setErrorEmail('Неправельный email')
      setVerifyEmail('')
    } else if (email === '') {
      setVerifyEmail('')
      setErrorEmail('')
    }
  }, [email])

  useEffect(() => {
    function isValidLength(password, min, max) {
        const length = password.length
        return length >= min && length <= max
      }
    if (isValidLength(password, 6, 20)) {
        setVerifyPass('Пароль подходит')
        setErrorPass('')
    } else if (!isValidLength(password, 6, 20) && password !== '') {
        setErrorPass('Количство символов должно быть от 6 до 20')
        setVerifyPass('')
    } else if (password === '') {
        setVerifyPass('')
        setErrorPass('')
    }
}, [password])

  return (
    <div className={styles['container']}>
      <div className={styles['title']}>
        <h1>Добро пожаловать в Notes!</h1>
      </div>
      <div className={styles['form-cont']}>
        {showForm1 && (
          <div className={styles['right']}>
            <h2 className={`${styles['header-text']} ${headerTextColor}`}>{headerText}</h2>
            <form className={styles['form']} onSubmit={handleSubmit}>
              <div className={styles['email-field']}>
              <input
                type="text"
                placeholder="Введите свой email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['input']}
              />  {errorEmail && <div className={styles['error-message']}>{errorEmail}</div>}
              {verifyEmail && <div className={styles['verify-message']}>{verifyEmail}</div>}
              </div>
            <div className={styles['password2']}>
              <div className={styles['password-field']}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Создайте свой пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles['input']}
                />
                <button
                  type="button"
                  className={styles['show-password-button']}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '❌' : '👁️'}
                </button>
              </div>
              {errorPass && <div className={styles['error-message']}>{errorPass}</div>}
              {verifyPass && <div className={styles['verify-message']}>{verifyPass}</div>}
              </div>
              <div className={styles['butcont']}>
                <button className={styles['submit']} type="submit">Далее</button> 
                <p>или</p>
                <button className={styles['login']} type="button" onClick={toggleForm2}>Войти</button>
              </div>
            </form>
          </div>
        )}
        {showForm2 && (
          <div className={styles['right']}>
             <h2 className={`${styles['header-text']} ${headerTextColor}`}>{headerText2}</h2>
            <form className={styles['form']} onSubmit={handleLogin}>
            <div className={styles['email-field']}>
            <input 
                type="text" 
                placeholder="Введите свой email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['input']}
              />
              </div>
              <div className={styles['password2']}>
              <div className={styles['password-field']}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Введите свой пароль" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles['input']}
                />
                <button 
                  type="button" 
                  className={styles['show-password-button']} 
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '❌' : '👁️'}
                </button>
                </div>
              </div>
              <div className={styles['butcont']}>
                <button className={styles['submit']} type="submit">Войти</button>
                <p>или</p>
                <button className={styles['regis']} type="button" onClick={toggleForm1}>Зарегистрироваться</button>
              </div>
            </form>
          </div>
        )}
        <div className={styles['left']}>
          <h3>Notes!</h3>
          <p>Notes - ваш персональный to-doo-list.</p>
          <p>Оставляй записи и напоминания в электронном виде. </p>
          <p>Все что нужно для входа - это ваш email.</p>
          <p>Взамен вы получаете неограниченое пространство для записей ...</p>
        </div>
      </div>
    </div>
  );
}

export default Home  
