import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';

const Wrapper = styled.div`
  display: flex;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(1, 1fr);
`;
const Board = styled.div`
  padding: 20px 10px;
  padding-top: 30px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
`;
const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  // 드래그가 끝났을 때 실행되는 함수. 어떤 일이 일어났는지에 대한 정보로 많은 argument를 줌
  // source는 움직임을 시작한 item의 index와 droppableId를 알려줌
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    if (!destination) return;
    setToDos((oldToDos) => {
      const copyToDos = [...oldToDos];
      console.log(copyToDos);
      // 1) Delete item on source.index
      copyToDos.splice(source.index, 1);
      console.log('Delete item', copyToDos);
      // 2) Put back the item on the destination.index
      console.log('Put back', draggableId, 'on ', destination.index);
      copyToDos.splice(destination?.index, 0, draggableId);
      return copyToDos;
    });
  };

  // onDragEnd 함수는 유저가 드래그를 끝낸 시점에 불려지는 함수
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {/* Droppable은 우리가 어떤 것을 드롭할 수 있는 영역을 의미 */}
          {/* droppable의 children은 함수여야 함. */}
          <Droppable droppableId="one">
            {/* droppable에서 주는 첫번째 argument는 provided(=magic) */}
            {(magic) => (
              // ul이 필요로 하는 prop들
              <Board ref={magic.innerRef} {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                  <Draggable key={toDo} draggableId={toDo} index={index}>
                    {(magic) => (
                      <Card
                        ref={magic.innerRef}
                        {...magic.dragHandleProps}
                        {...magic.draggableProps}
                      >
                        {toDo}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {magic.placeholder}
              </Board>
            )}
          </Droppable>
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
