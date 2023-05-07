// Import React dependencies.
import React, { useState, useCallback, useMemo } from 'react'
// Import the Slate editor factory.
import { createEditor, Editor, Transforms, Element, Text } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

// const initialValue = [
//   {
//     type: 'paragraph',
//     children: [{ text: 'A line of text in a paragraph.' }],
//   },
// ]


// Define a React component renderer for our code blocks.
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}

// Define a React component to render leaves with bold text.
const Leaf = props => {
  return (
    // span because all leaves must be an inline element
    // -> https://docs.slatejs.org/concepts/09-rendering#leaves
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

const SlateEditor = () => {
    const [editor] = useState(() => withReact(createEditor()))

    // get value in local storage or a new value if local storage is empty
    const initialValue = useMemo(
      () => {
        return JSON.parse(localStorage.getItem('content'))
          || [
            {
              type: 'paragraph',
              children: [{ text: 'A line of text in a paragraph.' }],
            },
          ];
      }, []
    )


    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                console.log('code time')
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} /> 
        }
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])


    return (
        <Slate
            editor={editor}
            value={initialValue}

            // save to local storage when content change
            onChange={value => {
              const isAstChange = editor.operations.some(
                op => 'set_selection' !== op.type
              )

              if (isAstChange) {
                // save to local storage
                const content = JSON.stringify(value)

                localStorage.setItem('content', content)
              }
            }}
        >
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}

                onKeyDown={event => {
                    if (!event.ctrlKey) {
                      switch (event.key) {
                        // this insert 'and ' whan type '&'
                        case '&': {
                          event.preventDefault()
                          editor.insertText('and ')

                          break
                        }

                        default : {
                          return
                        }
                      }
                    } else if (event.ctrlKey) {
                      switch (event.key) {

                        // this switch from code to paragraph
                        case 'k': {
                            event.preventDefault()

                            // is this a code block?
                            const [match] = Editor.nodes(editor, {
                              match: n => n.type === 'code',
                            })

                            Transforms.setNodes(
                                editor,
                                // set new type to paragraph or code block
                                { type: match ? 'paragraph' : 'code' },
                                {
                                    match: n => Editor.isBlock(editor, n),
                                    mode: 'all', // <- buggy documentation... make work with this.

                                    // match: (n) => {
                                    //     Element.isElement(n)
                                    //         && Editor.isBlock(editor, n)
                                    // } // <- this from doc don't work
                                }
                            )

                            break
                        }

                        case 'b': {
                            event.preventDefault()

                            Transforms.setNodes(
                              editor,
                              { bold: true },
                              {
                                match: n => Text.isText(n), split: true
                              }
                            )
                        }
                      }
                    }
                }}
            />
        </Slate>
    )
}

export default SlateEditor