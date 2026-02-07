'use client';
// import type { Editor, JSONContent } from '@/components/ui/shadcn-io/editor';
// import {
//   EditorBubbleMenu,
//   EditorCharacterCount,
//   EditorClearFormatting,
//   EditorFloatingMenu,
//   EditorFormatBold,
//   EditorFormatCode,
//   EditorFormatItalic,
//   EditorFormatStrike,
//   EditorFormatSubscript,
//   EditorFormatSuperscript,
//   EditorFormatUnderline,
//   EditorLinkSelector,
//   EditorNodeBulletList,
//   EditorNodeCode,
//   EditorNodeHeading1,
//   EditorNodeHeading2,
//   EditorNodeHeading3,
//   EditorNodeOrderedList,
//   EditorNodeQuote,
//   EditorNodeTable,
//   EditorNodeTaskList,
//   EditorNodeText,
//   EditorProvider,
//   EditorSelector,
//   EditorTableColumnAfter,
//   EditorTableColumnBefore,
//   EditorTableColumnDelete,
//   EditorTableColumnMenu,
//   EditorTableDelete,
//   EditorTableFix,
//   EditorTableGlobalMenu,
//   EditorTableHeaderColumnToggle,
//   EditorTableHeaderRowToggle,
//   EditorTableMenu,
//   EditorTableMergeCells,
//   EditorTableRowAfter,
//   EditorTableRowBefore,
//   EditorTableRowDelete,
//   EditorTableRowMenu,
//   EditorTableSplitCell,
// } from '@/components/ui/shadcn-io/editor';
import { useState } from 'react';

// Mock types for now
type JSONContent = any;
type Editor = any;

const TaskEditor = ({ content, onChange }: { content?: JSONContent, onChange?: (json: JSONContent) => void }) => {
  // const [internalContent, setContent] = useState<JSONContent>(content || {
  //   type: 'doc',
  //   content: [
  //     {
  //       type: 'paragraph',
  //       content: [{ type: 'text', text: 'Start typing...' }],
  //     },
  //   ],
  // });

  // const handleUpdate = ({ editor }: { editor: Editor }) => {
  //   const json = editor.getJSON();
  //   setContent(json);
  //   if (onChange) onChange(json);
  // };

  return (
    <div className="h-full w-full border rounded-md p-4 bg-background">
      <p className="text-muted-foreground">Editor component is currently disabled pending installation of dependencies.</p>
      {/* 
    <EditorProvider
      className="h-full w-full overflow-y-auto rounded-lg border bg-background p-4"
      data-lenis-prevent
      content={internalContent}
      onUpdate={handleUpdate}
      placeholder="Start typing..."
    >
      <EditorFloatingMenu>
        <EditorNodeHeading1 hideName />
        <EditorNodeBulletList hideName />
        <EditorNodeQuote hideName />
        <EditorNodeCode hideName />
        <EditorNodeTable hideName />
      </EditorFloatingMenu>
      <EditorBubbleMenu>
        <EditorSelector title="Text">
          <EditorNodeText />
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeHeading3 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeTaskList />
          <EditorNodeQuote />
          <EditorNodeCode />
        </EditorSelector>
        <EditorSelector title="Format">
          <EditorFormatBold />
          <EditorFormatItalic />
          <EditorFormatUnderline />
          <EditorFormatStrike />
          <EditorFormatCode />
          <EditorFormatSuperscript />
          <EditorFormatSubscript />
        </EditorSelector>
        <EditorLinkSelector />
        <EditorClearFormatting />
      </EditorBubbleMenu>
      <EditorTableMenu>
        <EditorTableColumnMenu>
          <EditorTableColumnBefore />
          <EditorTableColumnAfter />
          <EditorTableColumnDelete />
        </EditorTableColumnMenu>
        <EditorTableRowMenu>
          <EditorTableRowBefore />
          <EditorTableRowAfter />
          <EditorTableRowDelete />
        </EditorTableRowMenu>
        <EditorTableGlobalMenu>
          <EditorTableHeaderColumnToggle />
          <EditorTableHeaderRowToggle />
          <EditorTableDelete />
          <EditorTableMergeCells />
          <EditorTableSplitCell />
          <EditorTableFix />
        </EditorTableGlobalMenu>
      </EditorTableMenu>
      <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
    </EditorProvider>
    */}
    </div>
  );
};
export default TaskEditor;
