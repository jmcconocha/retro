import React from "react";
import io from "socket.io-client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Header from "./Header";
import Columns from "./Columns";
import { FlexContainer } from "../styles/styledComponents";
import { LOCAL_BACKEND_ENDPOINT } from "../utils";
import { onBoardEvents, onColumnEvents, onCardEvents } from "../events";
import { UPDATE_BOARD, CONNECT, JOIN_BOARD } from "../events/event-names";
import { emptyBoard } from "../utils/emptyBoard";

export default class Board extends React.Component {
  state = { ...emptyBoard };

  socket = io(LOCAL_BACKEND_ENDPOINT);

  componentDidMount() {
    this.socket.on(CONNECT, () => {
      console.log(">>> Joined Board <<<")
      this.socket.emit(JOIN_BOARD, this.props.boardId);
    });

    onBoardEvents(this);
    onColumnEvents(this);
    onCardEvents(this);
  }

  onDragEnd = dragResult => {
    const { draggableId, source, destination, type } = dragResult;
    const { columns, columnOrder } = this.state;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder
      };

      this.setState(newState);
      this.socket.emit(UPDATE_BOARD, newState);
      return;
    }

    const startColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    // column is the same
    if (startColumn === destinationColumn) {
      const newItemIds = Array.from(startColumn.itemIds);
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, itemIds: newItemIds };
      const newState = {
        ...this.state,
        columns: {
          ...columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
      this.socket.emit(UPDATE_BOARD, newState);
      return;
    }

    // moving from one column to another one
    const startItemIds = Array.from(startColumn.itemIds);
    startItemIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      itemIds: startItemIds
    };

    const finishItemIds = Array.from(destinationColumn.itemIds);
    finishItemIds.splice(destination.index, 0, draggableId);
    const newDestination = {
      ...destinationColumn,
      itemIds: finishItemIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...columns,
        [newStart.id]: newStart,
        [newDestination.id]: newDestination
      }
    };

    this.setState(newState);
    this.socket.emit(UPDATE_BOARD, newState);
  };

  renderBoard(columns, items) {
    return this.state.columnOrder.map((columnId, index) => {
      const column = columns[columnId];
      return (
        <Columns
          key={column.id}
          column={column}
          itemMap={items}
          index={index}
        />
      );
    });
  }

  render() {
    const { columns, items, title } = this.state;

    return (
      <div>
        <Header title={title} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable
            droppableId="allColumns"
            direction="horizontal"
            type="column"
          >
            {provided => (
              <FlexContainer
                {...provided.droppableProps}
                innerRef={provided.innerRef}
              >
                {this.renderBoard(columns, items)}
                {provided.placeholder}
              </FlexContainer>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}
