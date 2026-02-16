export default function LoadingState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="animate-spin text-7xl">✨</div>
        <div className="absolute inset-0 animate-ping text-7xl opacity-20">✨</div>
      </div>
      <p className="mt-6 text-xl font-medium text-purple-700 animate-pulse">
        {message}
      </p>
    </div>
  );
}