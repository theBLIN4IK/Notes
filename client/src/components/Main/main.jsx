import { format, parseISO, set } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './main.module.css'
import React, { useState, useEffect, useRef } from 'react'
import { useUserStore } from '../../../store/userStore'
import axios from 'axios'
import { useTasksStore } from '../../../store/tasksStore'
import { Navigate, useNavigate } from'react-router-dom';


function Main() {
  const navigate = useNavigate()
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [user, setUser] = useState({});
  const [task, setTask] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [fileName, setFileName] = useState('Выбрать фото');
  const fileInputRef = useRef(null);
  const fileRef = useRef(null);
//  userStore
  const email = useUserStore((state) => state.email)
  const id = useUserStore((state) => state.id)

// taskStore
  const tasks = useTasksStore((state) => state.tasks)
  const addTaskToStore = useTasksStore((state) => state.addTaskToStore)
  const updateTaskInStore = useTasksStore((state) => state.updateTaskInStore)
  const deleteTaskFromStore = useTasksStore((state) => state.deleteTaskFromStore)
  const getTasks = useTasksStore((state) => state.getTasks)

  function togglePanel() {
    setIsPanelOpen(!isPanelOpen)
  }
  const toggleTaskPanel = () => {
    setIsTaskPanelOpen(!isTaskPanelOpen);
  }
  const handleCloseTaskPanel = () => {
    setSelectedTask(null);
    setIsEditing(false);
    toggleTaskPanel();
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddTask()
    }
  }
  const handleEditTask = () => {
    setEditedTaskText(selectedTask.text)
    setIsEditing(true)
  };
  const startEditingName = () => {
    setEditedName(user.name);
    setIsEditingName(true);
  };
  const handleTaskClick = (taskText) => {
    setSelectedTask(taskText)
  }
  const [headerText, setHeaderText] = useState('Мой To-Doo-List')
  const [headerText2, setHeaderText2] = useState('Задача:')
  const [headerText3, setHeaderText3] = useState('Профиль')

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/getUser/${email}`)
        setUser(response.data);
        const tasksResponse = await axios.get(`http://localhost:3000/api/tasks/${response.data._id}`)
        getTasks(tasksResponse.data) 
      } catch (error) {
        setHeaderText('Ошибка получения задач')
      }
    }
    if (email) {
      fetchUserData()
    }
  }, [email, id, addTaskToStore])
const handleAddTask = async () => {
  if (!task) return;
  try {
    const response = await axios.post('http://localhost:3000/api/postTask', {
      userId: user._id,
      task,
    });
    addTaskToStore({
      ...response.data,
      text: task,
      createdAt: response.data.userTask.createdAt,
      _id: response.data.userTask._id,
    });
    setTask('');
  } catch (error) {
    console.error('Error adding task:', error);
    setHeaderText('Ошибка добавления задачи');

  }
}
  const handleDeleteTask = async () => {
    try {
      const taskId = selectedTask._id
      const response = await axios.delete(`http://localhost:3000/api/deleteTask/${taskId}`)
      deleteTaskFromStore(selectedTask);
      setSelectedTask('')
    } catch (error) {
      console.error('Error deleting task:', error)
      console.log(error)
      setHeaderText2('Ошибка удаления')
    }
  }
  const handleSaveTask = async () => {
    if (editedTaskText.trim().length < 1) {
      return
    }
    try {
      const taskId = selectedTask._id
      const response = await axios.put(`http://localhost:3000/api/updateTask/${taskId}`, {
        userId: user._id,
        text: editedTaskText
      })
      setSelectedTask((prev) => ({ ...prev, text: editedTaskText }))
      updateTaskInStore({ ...selectedTask, text: editedTaskText })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating task:', error)
      setHeaderText2('Ошибка обновления')
    }
  }
  const handleSaveName = async () => {
    if (editedName.trim().length < 1) {
      setHeaderText3('имя короткое')
    }
    try {
      const response = await axios.put(`http://localhost:3000/api/updateUser/${user._id}`, {
        name: editedName
      });
      setUser((prev) => ({...prev, name: editedName }))
      setIsEditingName(false)
    } catch (error) {
      console.error(error.response.data.message)
      setHeaderText3(error.response.data.message)
      

    }
  }
  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/logout', { withCredentials: true })
      setIsPanelOpen(false)
      navigate('/')
    } 
    catch (error) {
      console.error(error.response.data.message)
      setHeaderText3(error.response.data.message)
    }
  }
  const groupTasksByDate = (tasks) => {
    return tasks.reduce((acc, task) => {
      const date = format(parseISO(task.createdAt), 'd MMMM yyyy', { locale: ru })
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(task)
      return acc
    }, {})
  }
  const groupedTasks = groupTasksByDate(tasks)
  const { userAvatar, setAvatar } = useUserStore()
  const [previewAvatar, setPreviewAvatar] = useState(null)
  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      const file = files[0]
      if (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/gif' ||
        file.type === 'image/webp'
      ) {
        setFileName(file.name)
        fileInputRef.current = file
        setPreviewAvatar(URL.createObjectURL(file))
      }
    }
  }

  useEffect(() => {
    if (fileInputRef.current) {
      const formData = new FormData()
      formData.append('avatar', fileInputRef.current)
      setAvatar(formData)
       
        .catch((error) => {
          console.error('Error uploading avatar:', error)
        })
    }
  }, [fileInputRef.current, setAvatar])



  return (
       <div className={styles['container']}>
    {/* панель */}
    <div className={`${styles['panel']} ${isPanelOpen ? styles['panel-open'] : ''}`}>
      <div className={styles['panelBtn']} onClick={togglePanel}>
        {isPanelOpen ? '<<' : '>>'}
      </div>
      <div className={styles['panel-content']}>
        <div className={styles['panel-top-cont']}>
          <h5>{headerText3}</h5>
          
          <div className={styles['cont1']}>
          <img src={previewAvatar || `http://localhost:3000/${user.avatar}`} className={styles['ava']} />
            <div className={styles['cont2']}>
              {isEditingName ? (
                <textarea 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)} 
                  maxLength={14}
                  className={`${styles['textarea']} ${editedName.length >= 14 ? styles['textarea-long'] : ''}`}
                />
              ) : (
                <p className={styles['name']}>{user.name}</p>
              )}
              <p className={styles['email']}>{user.email}</p>
            </div>
          </div>
        </div>
        <div className={styles['panel-bottom-cont']}>
          <ul className={styles['panel-list']}>
            <h1>Настройки</h1>
            <li className={styles['item']} onClick={isEditingName ? handleSaveName : startEditingName}>
              {isEditingName ? 'Сохранить' : 'Изменить ник'}
            </li>
            <li className={styles['item']}> Изменить аватар
              <input type="file" onChange={handleFileInputChange} className={styles['kdkdkd']} ref={fileRef} />
              </li>
            <li className={styles['item']} onClick={handleLogout}>Выйти</li>
          </ul>
        </div>
      </div>
    </div>
        {/* внутрянка сайта */}
    <div className={styles['container2']}>
    <div className={styles['tasks']}>
  <div className={styles['task-title']}>{headerText}</div>
  <div className={styles['task-add']}>
    <input
      value={task}
      type="text"
      maxLength={33}
      onChange={(e) => setTask(e.target.value)}
      placeholder="Введите новую задачу"
      className={`${styles['input']} ${task.length >= 33 ? styles['input-error'] : ''}`}
      onKeyDown={handleKeyDown}
    />
    <button onClick={handleAddTask} className={styles['addbutton']}>
      +
    </button>
  </div>
  {Object.keys(groupedTasks).length === 0 ? (
    <div className={styles['no-tasks']}>Задач пока нет...</div>
  ) : (
    <ul className={styles['task-list']}>
      {Object.keys(groupedTasks).reverse().map((date) => (
        <div className={styles['something-that-i-dont-know']} key={date}>
          <div className={styles['date-header']}>{date}</div>
          {groupedTasks[date].map((task, index) => (
            <li
              key={index}
              className={styles['task-item']}
              onClick={() => {
                handleTaskClick(task);
                toggleTaskPanel();
              }}
            >
              {task.text}
              <p className={styles['task-date']}>
                {new Date(task.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </li>
          ))}
        </div>
      ))}
    </ul>
  )}
</div>

<div className={`${styles['inTask']} ${isTaskPanelOpen ? styles['inTask-open'] : ''}`}>
  <div className={styles['task-title2']}>
    <span className={styles['span']}>Задача:</span>
    <button className={styles['exit']} onClick={() => { handleTaskClick(task); handleCloseTaskPanel() }}>✖</button>
  </div>
  {selectedTask ? (
    <>
      {isEditing ? (
        <textarea
          value={editedTaskText}
          onChange={(e) => setEditedTaskText(e.target.value)}
          maxLength={33}
          className={`${styles['taskEditArea']} ${editedTaskText.length >= 33 ? styles['taskEditAreaerr'] : ''}`}
        />
      ) : (
        <p className={styles['task-text']}>{selectedTask.text}</p>
      )}
      <div className={styles['task-title2']}>Добавлено:</div>
      <p className={styles['task-date2']}>{format(parseISO(selectedTask.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru })}</p>
      <div className={styles['task-btns']}>
        {isEditing ? (
          <button className={styles['redact']} onClick={handleSaveTask}>
            Сохранить
          </button>
        ) : (
          <button className={styles['redact']} onClick={handleEditTask}>
            Изменить
          </button>
        )}
        <button className={styles['del']} onClick={() => { handleDeleteTask(); handleCloseTaskPanel() }}>
          Удалить
        </button>
      </div>
      <p className={styles['task-id']}>{`id - ${selectedTask._id}`}</p>
    </>
  ) : (
    <div className={styles['no-task-selected']}>Нажмите на задачу в списке для её просмотра</div>
  )}
</div>
    </div>
  </div>
)
}

export default Main

