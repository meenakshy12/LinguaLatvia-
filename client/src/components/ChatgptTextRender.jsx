import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';


const ChatgptTextRender = ({text}) => {
      // Convert markdown to HTML
  const rawHtml = marked.parse(text || '');

  // Sanitize the HTML
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  )
}

export default ChatgptTextRender


