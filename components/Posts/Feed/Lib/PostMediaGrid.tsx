import Image from "next/image";
import clsx from "clsx";

export default function PostMediaGrid({ media, setCurrentImageIndex, openLightbox }: any) {
    if (!media?.length) return null;

    const cols = media.length === 1 ? 1 : media.length === 2 ? 2 : media.length === 3 ? 3 : 2;

    return (
        <div
            className={clsx(
                "grid gap-2 px-4 pb-4",
                cols === 1 && "grid-cols-1",
                cols === 2 && "grid-cols-2",
                cols === 3 && "grid-cols-3"
            )}
        >
            {media.map((item: any, idx: number) => (
                <div
                    key={idx}
                    className={clsx(
                        "relative w-full",
                        cols === 1 ? "h-64" : cols === 2 ? "h-48" : cols === 3 ? "h-40" : "h-36"
                    )}
                    onClick={() => {
                        // setCurrentImageIndex?.(idx);
                        // openLightbox?.();
                    }}
                >
                    <Image
                        src={item.url}
                        alt={`media-${idx}`}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            ))}
        </div>
    );
}
