import { memo } from 'react';
import styled from 'styled-components';
import { Box } from 'rebass/styled-components';

import TaskListItem from 'components/TaskListItem';

export const Wrapper = styled(Box)`
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  background: white;
`;

export default memo(({ tasks, onChangeStatus }) => {
  return (
    <Wrapper as="ul" p={3} m={0} backgroundColor="white">
      {Object.keys(tasks).map((id) => (
        <TaskListItem key={id} {...tasks[id].toDetail()} onChangeStatus={onChangeStatus} />
      ))}
    </Wrapper>
  );
});
