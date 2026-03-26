import Link from "next/link";

export default function Footer() {

    return (
        <footer className="flex flex-col gap-5 px-4 sm:px-6 py-5 items-center justify-center text-center">
            <p className="text-neutral-500 text-sm sm:text-base">
                Any queries or suggestions, we are here to listen. Mail us to{" "}
                <Link href="mailto:pavan.kona@tradiohub.com" className="underline">
                    pavan.kona@tradiohub.com
                </Link>
            </p>
        </footer>
    )
}
