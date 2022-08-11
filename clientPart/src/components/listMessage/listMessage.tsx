import React, { FunctionComponent, memo, Ref, useEffect, useRef } from 'react';
import Stack from '@mui/material/Stack';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IConfiguredPublisher, IMQTTMessage } from '../../dtos/MQTTEntities';
import { PublisherCard } from '../publisherCard/publisherCard';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useActions } from '../../hooks/useActions';
import Divider from '@mui/material/Divider';
import { FixedSizeList, ListChildComponentProps, areEqual, VariableSizeList, FixedSizeGrid, ReactElementType } from 'react-window';
import { MessageCard } from '../messageCard/messageCard';

interface IListMessageProps {
    messages: IMQTTMessage[] | undefined,
    mainTopic: string
}

const Row = memo((props: ListChildComponentProps) => {
    // Data passed to List as "itemData" is available as props.data
    const { data, index, style } = props

    return (
      <div style={style}>
        <MessageCard
            mainTopic={data.mainTopic}
            index={index}
            setRowHeight={data.setRowHeight}
            rowHeights={data.rowHeights}
            clearRowHeights={data.clearRowHeights}
            topic={data.messages[index].topic} 
            retain={data.messages[index].retain} 
            qos={data.messages[index].qos} 
            message={data.messages[index].message}
            time={data.messages[index].time}>
        </MessageCard>
      </div>
    );
  }, areEqual);

export const ListMessage: FunctionComponent<IListMessageProps> =
    (props: IListMessageProps) => {
        const { messages = [], mainTopic } = props;
        const rowHeights = useRef(new Map());

        if (messages.length === 0) {
          rowHeights.current.clear();
        }

        const { connection, topicsAutoScroll } = useTypedSelector(state => state.connection);

        useEffect(() => {
          if (topicsAutoScroll.get(mainTopic)) {
            listRef.current?.scrollToItem(messages.length - 1);
          }
        }, [messages.length])

        const listRef: React.RefObject<VariableSizeList<any>> = useRef(null)

        const getRowHeight = (index: number) => {
          let value = 0;

          if  (rowHeights.current && rowHeights.current.has(index)) {
            value = rowHeights.current.get(index)
          }

          if (listRef.current?.props.itemData.rowHeight) {
            value = listRef.current?.props.itemData.rowHeight;
          }

          return value || 250;
        }
        
        const setRowHeight = (index: number, size: number) => {
          listRef.current!.resetAfterIndex(0);

          rowHeights.current.set(index, size);
        }

        const clearRowHeights = () => {
          rowHeights.current.clear();

          listRef.current!.resetAfterIndex(0);
        }

        return (
            <Stack spacing={2}>
                  <VariableSizeList
                    height={connection.topics.get(mainTopic)?.isGlobal ? 352 : 500}
                    width='100%'
                    itemSize={getRowHeight}
                    ref={listRef}
                    itemData={{ messages, mainTopic, setRowHeight, rowHeights, clearRowHeights }}
                    overscanCount={10}
                    itemCount={messages.length}
                    >
                        {Row}
                </VariableSizeList>
            </Stack>
        )
  };