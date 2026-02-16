export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 my-6">
      <div className="flex items-start">
        <div className="text-4xl mr-4">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-700 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}