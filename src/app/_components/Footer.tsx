import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-2">
      <div className="container mx-auto flex flex-row items-center justify-between px-4 text-xs">
        <p className="text-gray-600">
          © 2024 silverbirder. All rights reserved.
        </p>
        <Link
          href="https://forms.gle/Y6e5tntQqZYysJEaA"
          target="_blank"
          prefetch={false}
        >
          お問い合わせ
        </Link>
      </div>
    </footer>
  );
}
