import Button from '../ui/Button';

const DeleteReviewDialog = ({ isOpen, onCancel, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-review-title"
    >
      <div className="absolute inset-0 bg-black/50" onClick={isLoading ? undefined : onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft">
        <h3 id="delete-review-title" className="font-display text-lg font-semibold text-bamboo-800">
          Delete your review?
        </h3>
        <p className="mt-2 text-sm text-bamboo-600">
          This will permanently remove your review. You can write a new one afterwards.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading} className="!px-4 !py-2 text-sm">
            Keep Review
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading} className="!px-4 !py-2 text-sm">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewDialog;