export default function OptionPanel({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const confirmDelete = () => {
    dialogRef.current?.showModal();
  };

  return (
    <details className="options-panel">
      <summary>Options</summary>
      <div className="button-group">
        <button className="button">Edit Memory</button>
        <button className="button warning" onClick={confirmDelete}>
          Delete Memory
        </button>
      </div>
    </details>
  );
}
