import MentionParser from "@/components/Posts/Feed/Lib/MentionParser";

export default function PostContent({ t, content }: { t: any, content: string }) {
    return (
        <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed text-white">
                <MentionParser t={t} text={content} />
            </p>
        </div>
    );
}
