import { useNavigate } from 'react-router-dom';
import { useApiFetch } from '@/utils/api.calls';


export default function DeleteMemoryDialog({
  dialogRef,
  id,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  id: string;
}) {
  const { fetchData, loading, error } = useApiFetch();
  const navigate = useNavigate();

  const deleteMemory = async () => {
    await fetchData(`${import.meta.env.VITE_API_URL}/memories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });
    navigate('/');
  };
  return (
    <dialog ref={dialogRef} className="delete-dialog">
      <h2>Delete Memory?</h2>
      <p>This action cannot be undone. All photos will be permanently deleted.</p>
      <div className="dialog-actions">
        <button className="button" onClick={() => dialogRef.current?.close()}>
          Cancel
        </button>
        <button
          className="button warning"
          onClick={() => {
            dialogRef.current?.close();
            deleteMemory();
          }}
        >
          Delete
        </button>
      </div>
    </dialog>
  );
}