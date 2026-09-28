import { parseReviews, type Review } from "./model";

/** Review files larger than this are refused before they are read. */
export const REVIEW_FILE_LIMIT = 2_000_000;

/** Downloads reviews as a review file, the JSON array of saved reviews that Import reads back. */
export function downloadReviews(reviews: readonly Review[], fileName: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(reviews, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * A file name for one review that says which review it holds in a downloads folder:
 * "data-quality-review-<name>.json", the name reduced to ASCII letters, digits and dashes.
 */
export function reviewFileName(review: Pick<Review, "name">): string {
  const slug = review.name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
  return slug ? `data-quality-review-${slug}.json` : "data-quality-review.json";
}

/** One review as its own review file. */
export function exportReview(review: Review) {
  downloadReviews([review], reviewFileName(review));
}

/**
 * The reviews in a file chosen for import, validated as strictly as stored reviews. A file over
 * the size limit is refused unread; the reasons speak of the file, not of stored data.
 */
export async function readReviewFile(file: File): Promise<Review[]> {
  if (file.size > REVIEW_FILE_LIMIT) throw new Error("Review files must be smaller than 2 MB.");
  const text = await file.text();
  try {
    return parseReviews(text);
  } catch (error) {
    throw new Error(
      error instanceof SyntaxError
        ? "It is not a JSON file."
        : "It does not hold valid Data Quality reviews.",
    );
  }
}
