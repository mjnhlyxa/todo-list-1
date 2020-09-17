import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Flex, Text } from 'rebass/styled-components';
import styled from 'styled-components';
import { columnsDefinition } from 'utils/constant';
import { propsComparison } from 'utils/helper';

const TaskContainer = styled(Flex).attrs(({ isDragDisabled }) => ({
  p: 2,
  mb: 2,
  flexDirection: 'row',
  opacity: isDragDisabled ? 0.5 : 1,
  fontSize: '12px',
}))`
  border: 1px solid lightgrey;
  border-left: 4px solid ${({ color }) => color};
  border-radius: 4px;
  transition: background-color 0.2s ease;
  background-color: ${({ isDragDisabled, isDragging }) =>
    isDragDisabled ? 'lightgrey' : isDragging ? 'lightgreen' : 'white'};
`;

const ColumnContainer = styled(Flex)`
  border: 1px solid lightgrey;
  border-radius: 4px;
`;

const TaskList = styled(Box).attrs(() => ({
  p: 2,
  flexGrow: 1,
  minHeight: '100px',
}))`
  transition: background-color 0.4s ease;
  background-color: ${({ isAllowedToDrop, isDraggingOver }) =>
    isDraggingOver ? (isAllowedToDrop ? '#cbe4c8' : '#ffd6d6') : '#f5f5f5'};
`;

export const Task = memo(({ task: { id, title, status, color }, index }) => {
  const isDragDisabled = status === 'DELETED';
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <TaskContainer
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}
          isDragging={isDragging}
          isDragDisabled={isDragDisabled}
          color={color}>
          {id} - {title}
        </TaskContainer>
      )}
    </Draggable>
  );
}, propsComparison);

export const Column = memo(({ column, tasks, checkDropPosibility }) => {
  return (
    <ColumnContainer flexDirection="column" width="220px" m={1}>
      <Text p={2} backgroundColor="#f5f5f5" fontWeight="bold">
        {column.title}
      </Text>
      <Droppable droppableId={column.id} type="TASK">
        {(
          { innerRef, droppableProps, placeholder },
          { isDraggingOver, draggingOverWith: taskId },
        ) => (
          <TaskList
            ref={innerRef}
            {...droppableProps}
            isAllowedToDrop={checkDropPosibility(taskId, column.id)}
            isDraggingOver={isDraggingOver}>
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {placeholder}
          </TaskList>
        )}
      </Droppable>
    </ColumnContainer>
  );
}, propsComparison);

export const TaskTable = ({ tasks, onChangeStatus }) => {
  const [columns, setColumns] = useState({});

  const ref = useRef(tasks);

  useEffect(() => {
    ref.current = tasks;
    updateColumns();
  }, [tasks]);

  const updateColumns = () => {
    const cols = {
      ...columnsDefinition.reduce((obj, curr) => {
        obj[curr.id] = {
          ...curr,
          taskIds: [],
        };
        return obj;
      }, {}),
    };

    Object.keys(tasks).forEach((id) => {
      const { status } = tasks[id];
      cols[status].taskIds.push(id);
    });

    setColumns(cols);
  };

  const onDragEnd = ({ destination, source, draggableId }) => {
    // Drop in blanks
    if (!destination) {
      return;
    }
    // Drop in same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    // Drop in column is not supported
    if (!tasks[draggableId].canChangeStateTo(destination.droppableId)) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    // Move in the same list
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
    onChangeStatus({ id: draggableId, status: destination.droppableId });
  };

  const checkDropPosibility = useCallback((taskId, columnId) => {
    return ref.current[taskId] && ref.current[taskId].canChangeStateTo(columnId);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex>
        {columnsDefinition.map(({ id: columnId }) => {
          const column = columns[columnId];
          return column ? (
            <Column
              key={columnId}
              column={column}
              tasks={column.taskIds.map((taskId) => tasks[taskId].toDetail())}
              checkDropPosibility={checkDropPosibility}
            />
          ) : null;
        })}
      </Flex>
      <Text as="span" opacity={0.6} fontSize={1}>
        (*) Drag & drop to move your tasks
      </Text>
    </DragDropContext>
  );
};

export default TaskTable;
