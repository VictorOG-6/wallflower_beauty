interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 20,
}: StarRatingProps) {
  const roundedRating = Math.round(rating);

  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: maxStars }, (_, i) => (
        <Star key={i} filled={i < roundedRating} size={size} />
      ))}
    </div>
  );
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#FBBF24" : "none"}
      stroke={filled ? "#FBBF24" : "#D1D5DB"}
      strokeWidth={1.5}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
