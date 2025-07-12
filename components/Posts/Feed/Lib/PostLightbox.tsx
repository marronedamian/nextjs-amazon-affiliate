import Lightbox from "yet-another-react-lightbox";
import Image from "next/image";

export default function PostLightbox({ open, onClose, index, media, user, likeCount, repostCount, commentCount }: any) {
    return (
        <Lightbox
            open={open}
            close={onClose}
            index={index}
            slides={media.map((img: any) => ({ src: img.url }))}
            styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
            render={{
                slide: ({ slide }) => (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <img src={slide.src} alt="Expanded" className="max-h-[90vh] object-contain rounded-lg" />
                        <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/60 px-4 py-2 rounded-full text-white">
                            <Image src={user.image || "/fallback-avatar.png"} alt="avatar" width={28} height={28} className="rounded-full object-cover" />
                            <div className="text-sm font-medium">@{user.username}</div>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-full text-white text-sm">
                            ❤️ {likeCount} · 🔁 {repostCount} · 💬 {commentCount}
                        </div>
                    </div>
                ),
            }}
        />
    );
}
