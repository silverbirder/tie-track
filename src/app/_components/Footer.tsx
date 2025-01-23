import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-2">
      <div className="container mx-auto flex flex-row items-center justify-between px-4 text-xs">
        <p className="text-gray-600">
          © {new Date().getFullYear()} silverbirder. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <Link
            href="https://forms.gle/Y6e5tntQqZYysJEaA"
            target="_blank"
            prefetch={false}
          >
            お問い合わせ
          </Link>
          <Link
            href="https://sites.google.com/view/silverbirders-services"
            target="_blank"
            prefetch={false}
          >
            関連サービス
          </Link>
        </nav>
      </div>
    </footer>
  );
}
