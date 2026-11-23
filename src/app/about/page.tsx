import { redirect } from 'next/navigation';

// About lives on the homepage again; keep old /about links working.
export default function AboutPage() {
  redirect('/#about');
}
