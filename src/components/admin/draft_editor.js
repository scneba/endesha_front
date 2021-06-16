import { Editor } from "react-draft-wysiwyg";
import React, { useState, useEffect } from "react";
import { EditorState } from "draft-js";
import draftToMarkdown from "draftjs-to-markdown";
import { convertToRaw } from "draft-js";
/**
 * Display a draft wysiwig and return markdown content
 * @param {*} param0
 * @returns
 */
export default function DraftEditor({ setConvertedContent, defaultValue }) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  useEffect(() => {
    // //convert to markdown when the state changes
    let hashConfig = {
      trigger: "#",
      separator: " ",
    };
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markup = draftToMarkdown(rawContentState, hashConfig);
    setConvertedContent(markup);
  }, [editorState]);

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={(state) => setEditorState(state)}
      wrapperClassName="wrapper-class"
      editorClassName="editor-class"
      toolbarClassName="toolbar-class"
    />
  );
}
