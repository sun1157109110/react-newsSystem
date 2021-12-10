import React, { useEffect, useState } from 'react'
import { EditorState, convertToRaw, ContentState  } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs';

export default function NewsReactDraft(props) {
    const [editorState, setEditorState] = useState("")
    const onEditorStateChange = (editorState)=>{
        setEditorState(editorState)
    };
    useEffect(() => {
        const html = props.updateContent;
        if(html===undefined){
            return
        }
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState)
        }
    }, [props.updateContent])
    
    const handleBlur = ()=>{
        // console.log(editorState);
        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        props.getEditorDate(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }
    return (
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
            onBlur={handleBlur}
        />
    )
}
