const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm">
      <div className="relative w-20 h-20">
        {/* Outer spinning ring */}
        <div
          className="
            absolute inset-0
            rounded-full
            border-4
            border-gray-300 dark:border-gray-600
            border-t-accent-secondary
            animate-spin
          "
        />

        {/* Inner pulse */}
        <div
          className="
            absolute inset-3
            rounded-full
            bg-accent-secondary/40
            dark:bg-accent-secondary/60
            animate-pulse
          "
        />
      </div>
    </div>
  );
};

export default Loader;
