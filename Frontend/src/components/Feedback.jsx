import { useState } from "react";
import { FiAlertCircle, FiImage, FiPackage } from "react-icons/fi";

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="feedback feedback-error" role="alert">
      <FiAlertCircle aria-hidden="true" />
      <span>{message}</span>
      {onRetry && <button className="text-button" type="button" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function SuccessMessage({ message }) {
  return <div className="feedback feedback-success" role="status">{message}</div>;
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <FiPackage className="empty-state-icon" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function ProductImage({ src, alt, className = "" }) {
  const [failedSrc, setFailedSrc] = useState("");

  if (!src || src === failedSrc) {
    return (
      <div className={`image-unavailable ${className}`} role="img" aria-label={`${alt}: image unavailable`}>
      <FiImage aria-hidden="true" />
      <span>Image unavailable</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} />;
}
