import { memo } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { Box, Flex, Text } from 'rebass/styled-components';
import { propsComparison } from 'utils/helper';

export const Wrapper = styled(Flex)`
  border-bottom: 1px solid #d4cfcf;
  border-right: 1px solid #d4cfcf;
  border-left: 8px solid ${({ blColor }) => blColor};
  border-radius: 4px;
  &:first-of-type {
    border-top: 1px solid #d4cfcf;
  }
`;

export const TaskState = styled(Box).attrs(() => ({
  m: 2,
  p: 1,
  width: '90px',
  fontWeight: 'bold',
  fontSize: '14px',
  lineHeight: '18px',
  textAlign: 'center',
  opacity: 0.6,
}))`
  border: 1px solid ${({ color }) => color};
  border-radius: 4px;
  font-style: italic;
`;

export const ActionButton = styled(Button).attrs(() => ({
  variant: 'outlined',
  size: 'small',
}))``;

export const Actions = styled(Flex)`
  ${ActionButton} {
    margin-left: 10px;
  }
`;

export default memo(({ id, title, label, color, actions, onChangeStatus }) => {
  return (
    <Wrapper blColor={color} pl={3} pr={3} flexDirection="row" background="white" lineHeight="45px">
      <TaskState color={color}>{label}</TaskState>
      <Text color="#424242" fontWeight="bold" mr={1}>
        {id}
      </Text>
      <Text flex={1} as="p" m="auto 0" color="#424242">
        - {title}
      </Text>
      <Actions flexDirection="row" height="35px" mt={1}>
        {actions.map(({ label: btnLabel, color: btnColor, status }) => (
          <ActionButton
            key={status}
            color={btnColor}
            onClick={() => onChangeStatus({ id, status })}>
            {btnLabel}
          </ActionButton>
        ))}
      </Actions>
    </Wrapper>
  );
}, propsComparison);
