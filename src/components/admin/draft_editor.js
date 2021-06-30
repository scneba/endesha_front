import { Editor } from "react-draft-wysiwyg";
import React, { useState, useEffect } from "react";
import draftToMarkdown from "draftjs-to-markdown";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
/**
 * Display a draft wysiwig and return markdown content
 * @param {*} param0
 * @returns
 */
export default function DraftEditor({
  setConvertedContent,
  rawState,
  setRawState,
}) {
  let defaultEditorState;
  if (rawState) {
    const contentState = convertFromRaw(rawState);
    defaultEditorState = EditorState.createWithContent(contentState);
  } else {
    defaultEditorState = EditorState.createEmpty();
  }
  const [editorState, setEditorState] = useState(() => defaultEditorState);

  useEffect(() => {
    // //convert to markdown when the state changes
    let hashConfig = {
      trigger: "#",
      separator: " ",
    };
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markup = draftToMarkdown(rawContentState, hashConfig);
    setRawState(rawContentState);
    setConvertedContent(markup);
  }, [editorState, setConvertedContent, setRawState]);

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
