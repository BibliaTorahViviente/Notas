
document.addEventListener('DOMContentLoaded', () => {
    const newNoteBtn = document.getElementById('new-note');
    const saveNoteBtn = document.getElementById('save-note');
    const downloadDocxBtn = document.getElementById('download-docx');
    const toggleModeBtn = document.getElementById('toggle-mode');
    const fontSelect = document.getElementById('font-select');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const themeSelect = document.getElementById('theme-select');
    const lineHeightSelect = document.getElementById('line-height-select');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteId = null;
    let isReadOnly = false;

    const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: '#editor-toolbar'
        }
    });

    function saveNote() {
        if (currentNoteId !== null) {
            notes[currentNoteId].content = quill.root.innerHTML;
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    }

    function createNote() {
        saveNote();
        const newNote = {
            id: notes.length,
            content: '',
            created_at: new Date(),
            category: 'General'
        };
        notes.push(newNote);
        currentNoteId = newNote.id;
        quill.setText('');
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function loadNoteContent(noteId) {
        currentNoteId = noteId;
        quill.root.innerHTML = notes[noteId].content;
    }

    function toggleReadMode() {
        isReadOnly = !isReadOnly;
        quill.enable(!isReadOnly);
        document.body.classList.toggle('read-only', isReadOnly);
        toggleModeBtn.textContent = isReadOnly ? 'Modo Edición' : 'Modo Lectura';
    }

    function applyFont() {
        quill.root.style.fontFamily = fontSelect.value;
    }

    function increaseFontSize() {
        const currentSize = parseFloat(window.getComputedStyle(quill.root).fontSize);
        quill.root.style.fontSize = (currentSize + 2) + 'px';
    }

    function decreaseFontSize() {
        const currentSize = parseFloat(window.getComputedStyle(quill.root).fontSize);
        quill.root.style.fontSize = (currentSize - 2) + 'px';
    }

    function applyTheme() {
        document.body.className = '';
        const theme = themeSelect.value;
        if (theme !== 'default') {
            document.body.classList.add(`${theme}-theme`);
        }
    }

    function applyLineHeight() {
        quill.root.style.lineHeight = lineHeightSelect.value;
    }

    function downloadDocx() {
        if (currentNoteId !== null) {
            const content = quill.getText();
            const doc = new docx.Document({
                sections: [{
                    properties: {},
                    children: [
                        new docx.Paragraph(content)
                    ]
                }]
            });

            docx.Packer.toBlob(doc).then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'nota.docx';
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }
    }

    newNoteBtn.addEventListener('click', createNote);
    saveNoteBtn.addEventListener('click', saveNote);
    downloadDocxBtn.addEventListener('click', downloadDocx);
    toggleModeBtn.addEventListener('click', toggleReadMode);

    fontSelect.addEventListener('change', applyFont);
    increaseFontBtn.addEventListener('click', increaseFontSize);
    decreaseFontBtn.addEventListener('click', decreaseFontSize);
    themeSelect.addEventListener('change', applyTheme);
    lineHeightSelect.addEventListener('change', applyLineHeight);

    if (notes.length > 0) {
        loadNoteContent(0);
    }
});
