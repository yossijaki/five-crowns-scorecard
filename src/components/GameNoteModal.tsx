import { useState, useEffect, useRef } from 'react';

interface GameNoteModalProps {
  initialNote: string;
  onSave: (note: string) => void;
  onCancel: () => void;
}

export function GameNoteModal({ initialNote, onSave, onCancel }: GameNoteModalProps) {
  const [note, setNote] = useState(initialNote);
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  // Prevent scrolling of background
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(note.length, note.length);
    }
  }, [note.length]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-dark-100 rounded-xl shadow-lg p-4 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Añadir nota a la partida</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 bg-dark-300 text-white border border-dark-100 rounded-lg 
                   focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Escribe una nota para esta partida..."
          rows={4}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-dark-300 text-white rounded-lg hover:bg-dark-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(note)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}