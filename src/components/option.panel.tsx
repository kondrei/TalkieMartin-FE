import { useNavigate } from 'react-router-dom';

export default function OptionPanel({
  dialogRef,
  id,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  id: string;
}) {
  const navigate = useNavigate();
  const confirmDelete = () => {
    dialogRef.current?.showModal();
  };

  const handleEdit = () => {
    return navigate(`/edit/${id}`);
  };

  return (
    <details open className="options-panel">
      <summary>Options</summary>
      <div className="button-group">
        <button className="button" onClick={handleEdit}>
          Edit Memory
        </button>
        <button className="button warning" onClick={confirmDelete}>
          Delete Memory
        </button>
      </div>
    </details>
  );
}
