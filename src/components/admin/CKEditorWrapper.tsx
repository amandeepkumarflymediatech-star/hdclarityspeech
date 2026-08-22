"use client";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useRef } from 'react';

// Define a custom upload adapter plugin for CKEditor
function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

class MyUploadAdapter {
  loader: any;
  xhr: XMLHttpRequest | null;

  constructor(loader: any) {
    this.loader = loader;
    this.xhr = null;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then((file: File) => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object
  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();
    // Point this to our new API route
    xhr.open('POST', '/api/upload', true);
    xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve: any, reject: any, file: File) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr!.addEventListener('error', () => reject(genericErrorText));
    xhr!.addEventListener('abort', () => reject());
    xhr!.addEventListener('load', () => {
      const response = xhr!.response;

      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content.
      resolve({
        default: response.url
      });
    });

    if (xhr!.upload) {
      xhr!.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file: File) {
    const data = new FormData();
    data.append('upload', file);
    this.xhr!.send(data);
  }
}

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
}

export default function CKEditorWrapper({ value, onChange }: CKEditorWrapperProps) {
  // Using useRef to track initialization to prevent double loading issues in React strict mode
  const editorRef = useRef<any>(null);

  return (
    <div className="prose prose-sm max-w-none ckeditor-container">
      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 400px;
        }
        .ck-editor__editable {
          border-bottom-left-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
        }
        .ck.ck-toolbar {
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0.75rem !important;
          background: #f8fafc !important;
          border-color: rgba(var(--color-secondary), 0.5) !important;
        }
        .ck.ck-editor__main > .ck-editor__editable {
          border-color: rgba(var(--color-secondary), 0.5) !important;
          background: rgba(var(--color-secondary), 0.05) !important;
        }
        .ck.ck-editor__main > .ck-editor__editable.ck-focused {
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 1px var(--color-accent) !important;
          background: white !important;
        }
      `}</style>
      <CKEditor
        editor={ClassicEditor as any}
        config={{
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'undo',
            'redo'
          ],
        }}
        data={value}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
        onReady={(editor: any) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}
