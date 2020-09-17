import { generateTaskId } from 'utils/helper';

export const columnsDefinition = [
  {
    id: 'TODO',
    title: 'To do',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In progress',
  },
  {
    id: 'DONE',
    title: 'Done',
  },
  {
    id: 'CANCELLED',
    title: 'Cancelled',
  },
  {
    id: 'DELETED',
    title: 'Deleted',
  },
];

export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
  DELETED: 'DELETED',
};

export const ACTIONS_MAPPING = {
  IN_PROGRESS: {
    label: 'Start',
    color: 'primary',
  },
  DONE: {
    label: 'Done',
    color: 'primary',
  },
  CANCELLED: {
    label: 'Cancel',
    color: 'default',
  },
  DELETED: {
    label: 'Delete',
    color: 'secondary',
  },
};

export const COLORS = {
  TODO: 'rgb(28, 115, 190)',
  IN_PROGRESS: 'rgb(160, 20, 151)',
  DONE: 'rgb(129, 215, 66)',
  DELETED: 'rgb(221, 51, 51)',
  CANCELLED: 'rgb(202, 194, 194)',
};

export const LABELS = {
  TODO: 'To do',
  IN_PROGRESS: 'In-progress',
  DONE: 'Done',
  DELETED: 'Deleted',
  CANCELLED: 'Cancelled',
};

export const Task = (function () {
  //Task flows definition
  const TASK_FLOWS = {
    TODO: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.DELETED], //This means in state [TODO] it is only possible to change state to [IN_PROGRESS] or [DELETED]
    IN_PROGRESS: [TASK_STATUS.DONE, TASK_STATUS.CANCELLED],
    DONE: [TASK_STATUS.DELETED],
    CANCELLED: [TASK_STATUS.DELETED],
    DELETED: [],
  };

  return class {
    constructor({
      id = generateTaskId(),
      createdDate = Date.now(),
      status = TASK_STATUS.TODO,
      title = '',
    }) {
      this.id = id;
      this.title = title;
      this.createdDate = createdDate;
      this.status = status;
    }

    getColor = () => COLORS[this.status];

    getLabel = () => LABELS[this.status];

    toJson = () => ({
      id: this.id,
      title: this.title,
      createdDate: this.createdDate,
      status: this.status,
    });

    toDetail = () => ({
      ...this.toJson(),
      label: this.getLabel(),
      color: this.getColor(),
      actions: TASK_FLOWS[this.status].map((status) => ({
        ...ACTIONS_MAPPING[status],
        status,
      })),
    });

    canChangeStateTo = (nextStatus) =>
      nextStatus === this.status || TASK_FLOWS[this.status].includes(nextStatus);

    updateStatus = (status) => {
      this.status = status;
    };
  };
})();
