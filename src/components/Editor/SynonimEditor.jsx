import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Transforms, Range } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import ContextMenu from '../ContextMenu/ContextMenu';
import {fetchSynonyms} from '../../utils/synonyms.js'

const MyEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph!' }],
    },
  ]);

  const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 } });

  const [synonyms, setSynonyms] = useState([])

  // const handleContextMenu = useCallback(
  //   (event) => {
  //     event.preventDefault();

  //     const { clientX, clientY } = event;
  //     setContextMenu({ visible: true, position: { x: clientX, y: clientY } });
  //   },
  //   [setContextMenu]
  // );

  const handleContextMenu = useCallback(
    async (event) => {
      event.preventDefault();

      const { clientX, clientY } = event;
      const selectedText = window.getSelection().toString();

      if (!selectedText) return;

      const SelectionSynonyms = await fetchSynonyms(selectedText);
      
      console.log('syn : ', SelectionSynonyms);

      setSynonyms(SelectionSynonyms);
      setContextMenu({ visible: true, position: { x: clientX, y: clientY } });
    },
  [setContextMenu, setSynonyms]
);


  const handleContextMenuItemClick = useCallback(
    (synonym) => {
      if (!editor.selection) return;

      Transforms.insertText(editor, synonym, { at: editor.selection, select: true });
      setContextMenu({ visible: false, position: { x: 0, y: 0 } });
    },
    [editor]
  );

  return (
    <div>
      <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
        <Editable onContextMenu={handleContextMenu} />
      </Slate>
      {contextMenu.visible && (
        <ContextMenu
          items={synonyms}
          position={contextMenu.position}
          onClick={handleContextMenuItemClick}
        />
      )}
    </div>
  );
};

export default MyEditor;

