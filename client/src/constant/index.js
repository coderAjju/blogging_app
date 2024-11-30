import 'highlight.js/styles/github.css'; // Highlight.js theme
import hljs from 'highlight.js';

export const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'], // Add the code-block option here
    ],
    syntax: {
      highlight: (text) => hljs.highlightAuto(text).value, // Syntax highlighting
    },
  };
  
export const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
    'code-block', // Include code-block in formats
  ];