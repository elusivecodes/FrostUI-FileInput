import { initComponent } from '@fr0st/ui';
import FileInput from './file-input.js';
import { _events } from './prototype/events.js';
import { _endLoading, _getButtons, _getFileNames, _refresh, _refreshDisabled, _startLoading } from './prototype/helpers.js';
import { _render } from './prototype/render.js';

// FileInput default options
FileInput.defaults = {
    uploadCallback: null,
    cancelCallback: null,
    removeCallback: null,
    initialValue: null,
    inputStyle: 'filled',
    browseStyle: 'secondary',
    removeStyle: 'light',
    uploadStyle: 'primary',
    cancelStyle: 'danger',
    multiSeparator: ', ',
    showBrowse: true,
    showUpload: true,
    showCancel: true,
    showRemove: true,
    showProgress: true,
};

// FileInput classes
FileInput.classes = {
    btn: 'btn',
    btnGroup: 'btn-group',
    fileNames: 'align-middle ms-2',
    formInput: 'form-input',
    hide: 'visually-hidden',
    icon: 'd-inline-block me-1',
    inputFilled: 'input-filled',
    inputOutline: 'input-outline',
    inputGroup: 'input-group',
    inputGroupFilled: 'input-group-filled',
    progress: 'progress mt-1',
    progressBar: 'progress-bar',
    progressError: 'bg-danger',
    progressSuccess: 'bg-success',
    spinner: 'spinner-border spinner-border-sm',
};

// FileInput icons
FileInput.icons = {
    browse: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5z" fill="currentColor"/></svg>',
    cancel: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91z" fill="currentColor"/></svg>',
    remove: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91z" fill="currentColor"/></svg>',
    upload: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M9 16v-6H5l7-7l7 7h-4v6H9m-4 4v-2h14v2H5z" fill="currentColor"/></svg>',
};

// FileInput lang
FileInput.lang = {
    browse: 'Browse',
    cancel: 'Cancel',
    remove: 'Remove',
    selectFiles: 'Select files ...',
    selectFile: 'Select file ...',
    upload: 'Upload',
    uploadFailed: 'Upload failed',
    uploadSuccess: 'Upload success',
};

// FileInput prototype
const proto = FileInput.prototype;

proto._endLoading = _endLoading;
proto._events = _events;
proto._getButtons = _getButtons;
proto._getFileNames = _getFileNames;
proto._refresh = _refresh;
proto._refreshDisabled = _refreshDisabled;
proto._render = _render;
proto._startLoading = _startLoading;

// FileInput init
initComponent('fileinput', FileInput);

export default FileInput;
