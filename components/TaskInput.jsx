import { useState, memo } from 'react';
import styled from 'styled-components';
import { Flex } from 'rebass/styled-components';

const Input = styled.input`
  appearance: none;
  padding: 8px 4px;
  display: block;
  flex: 1;
  border: 1px solid #dedede;
  border-radius: 2px;
`;

export default memo(({ onAdd }) => {
  const [taskTitle, updateTaskTitle] = useState('');
  const addTask = (e) => {
    e.preventDefault();
    if (onAdd && taskTitle) {
      onAdd(taskTitle);
    }
    updateTaskTitle('');
  };

  return (
    <Flex onSubmit={addTask} as="form" mt={3} mb={3}>
      <Input
        type="text"
        value={taskTitle}
        onChange={(e) => updateTaskTitle(e.currentTarget.value)}
        placeholder="Input your task"
      />
    </Flex>
  );
});
