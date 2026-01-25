export default function Thumbnails({
  file,
  handleRemoveFile,
}: {
  file: File & { preview: string } | string;
  handleRemoveFile: (fileName: string) => void;
}) {
  return (
    <>
    <div className="thumb" key={typeof file === 'string' ? file : file.name}>
      <div className="close" onClick={() => handleRemoveFile(typeof file === 'string' ? file : file.name)}>
        x
      </div>
      <div className="thumbInner">
        <img
          src={typeof file === 'string' ? file : file.preview}
          className="img"
          onLoad={() => {
            if (typeof file !== 'string') {
              URL.revokeObjectURL(file.preview);
            }
          }}
        />
      </div>
    </div>
    </>
  );
}
