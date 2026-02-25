function Avatar({ src, name, size = "md", showStatus = false, status = "offline" }) {
  const sizeMap = {
    sm: "w-9 h-9 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-16 h-16 text-lg",
  };
  const statusColor = status === "online" ? "bg-green-500" : "bg-gray-400";

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover`} />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-600`}
        >
          {name?.charAt(0).toUpperCase()}
        </div>
      )}
      {showStatus && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border-2 border-white`} />
      )}
    </div>
  );
}

export default Avatar;
