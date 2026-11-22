import Link from 'next/link';

/** The mark and name, top left on every page. */
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Ahmad Firas, home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Images/optimized/favicon-192.png" alt="" width={32} height={32} />
      <span>Ahmad Firas</span>
    </Link>
  );
}
