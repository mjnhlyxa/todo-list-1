import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Box, Text } from 'rebass/styled-components';
import io from 'socket.io-client';
import Switch from '@material-ui/core/Switch';
import TaskList from 'components/TaskList';
import TaskInput from 'components/TaskInput';
import TaskTable from 'components/TaskTable';
import { Task } from 'utils/constant';

const WebPage = styled.div`
  background-color: 'white';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-family: sans-serif;
`;

const Header = () => (
  <Head>
    <title>Todo Task Web App</title>
  </Head>
);

export const convertTasksFromRawData = (data) => {
  const tasks = {};
  Object.keys(data).map((id) => {
    tasks[id] = new Task(data[id]);
  });
  return tasks;
};

export default () => {
  const [tasks, setTasks] = useState({});
  const [socket, addSocket] = useState(null);
  const [viewMode, setViewMode] = useState(true);

  useEffect(() => {
    setupSocket(); //setup socket io
    fetchTasks(); // fetch tasks from localStorage
  }, []);

  const fetchTasks = () => {
    let tasks;
    try {
      tasks = convertTasksFromRawData(JSON.parse(localStorage.getItem('tasks'))) || {};
    } catch {
      tasks = {};
    }
    setTasks(tasks);
  };

  const setupSocket = (socket) => {
    const sk = io();
    sk.on('refresh', (data) => {
      const tasks = convertTasksFromRawData(data);
      setTasks(() => tasks);
    });
    addSocket(sk);
  };

  const saveTask = (tasks) => {
    const data = {};
    Object.keys(tasks).forEach((id) => {
      data[id] = tasks[id].toJson();
    });

    localStorage.setItem('tasks', JSON.stringify(data));
    socket && socket.emit('saveTasks', data);
  };

  const onAddNewTask = useCallback(
    (title) => {
      const task = new Task({ title });
      setTasks((prevTasks) => {
        const tasks = { ...prevTasks, [task.id]: task };
        saveTask(tasks);
        return tasks;
      });
    },
    [socket],
  );

  const onChangeStatus = useCallback(
    ({ id, status }) => {
      setTasks((prevTasks) => {
        const task = prevTasks[id];
        task.updateStatus(status); // update status
        const tasks = { ...prevTasks, [id]: task };
        saveTask(tasks);
        return tasks;
      });
    },
    [socket],
  );

  const onSwitchView = ({ target: { checked } }) => {
    setViewMode(checked);
  };

  return (
    <WebPage>
      <Header />
      <Box maxWidth="996px" width="1000px" m="auto">
        <TaskInput onAdd={onAddNewTask} />
        <Box textAlign="right">
          <Text as="span">Switch view:</Text>
          <Switch
            checked={viewMode}
            onChange={onSwitchView}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </Box>
        {viewMode ? (
          <TaskList tasks={tasks} onChangeStatus={onChangeStatus} />
        ) : (
          <TaskTable tasks={tasks} onChangeStatus={onChangeStatus} />
        )}
      </Box>
    </WebPage>
  );
};
