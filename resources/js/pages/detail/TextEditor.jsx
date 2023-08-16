import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from "jodit-react";
// import "./styles.css";

export default function TextEditor(props) {
  const editor = useRef(null)

  const parser = new DOMParser();
  const htmlString = "<p>Enter Your Description Here:</p>";
  const doc3 = parser.parseFromString(props.defalt, "text/html");
  const defaultEmail = doc3.body.innerHTML;
  //const defaultEmail= "Default email text";
  const [content, setContent] = useState(defaultEmail);
  /*useEffect(() => {
    if (doc3) {
      setContent(doc3);
    }
  }, [htmlString]);*/
  const handleChnge = (content)=>{
    props.handleVali(content);
    setContent(content);
  }
	
	const config = {
    readonly: false,
    toolbarAdaptive: false,
    buttons: [
      'undo',
      'redo',
      'font',
      'fontsize',
      'bold',
      'italic',
      'underline',
      'eraser',
      'brush',
      'link',
      'ul',
      'ol',
      'indent',
      'outdent',
      'left',
      'fullsize',
      'source',
    ],
    "showCharsCounter": false,
    "showWordsCounter": false,
    "showXPathInStatusbar": false,
  }	
//   Jodit.make('#edit', {
//     limitChars: 5000,
//     limitHTML: true
// });
	return (
    content != "undefined" ?
    useMemo(() => (
      <JoditEditor
        ref={editor}
        value={ content }
        config={config}
        id = "edit" 
        // toolbarStickyOffset = '100'
        name = "description"
        tabIndex={1} // tabIndex of textarea
        //onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        // onChange={newContent => {}}
        onChange={content => handleChnge(content)}
      />
    ), [])
    : "...Loading"
  );
};


